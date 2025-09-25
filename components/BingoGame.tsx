import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import type { BingoCard, BingoCellData } from '../types';
import { useHabiticaApi } from '../hooks/useHabiticaApi';
import { DownloadIcon, RefreshIcon, PlayIcon, XIcon } from './icons';
import html2canvas from 'html2canvas';


const BingoCell: React.FC<{ 
    cell: BingoCellData | null; 
    onClick: () => void;
    isGameStarted: boolean; 
}> = ({ cell, onClick, isGameStarted }) => {
    if (!cell) return <div className="bg-habitica-dark rounded-md"></div>;
    
    const { task, manuallyCompleted, isUnavailable } = cell;
    const isCompletedByHabitica = task.completed;
    const isComplete = manuallyCompleted || isCompletedByHabitica;
    
    const cellClasses = [
        "bg-habitica-dark",
        "rounded-md p-1 flex items-center justify-center text-center",
        "relative aspect-square transition-all duration-300",
        isGameStarted ? "cursor-pointer" : "cursor-default",
        isUnavailable ? "line-through text-habitica-text-secondary" : "text-white",
    ].join(' ');

    return (
        <div className={cellClasses} onClick={isGameStarted ? onClick : undefined}>
            <p className={`font-semibold text-sm md:text-base ${isComplete ? 'opacity-50' : ''}`}>{task.text}</p>
            {isComplete && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <XIcon className="w-1/2 h-1/2 text-white opacity-100" />
                </div>
            )}
            {isUnavailable && !isComplete && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                    <span className="font-bold text-red-500 text-xs">UNAVAILABLE</span>
                </div>
            )}
        </div>
    );
};

const BingoGame: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [cards, setCards] = useLocalStorage<BingoCard[]>('bingo-cards', []);
    const [card, setCard] = useState<BingoCard | null>(null);
    const [lastSync, setLastSync] = useLocalStorage<number | null>(`last-sync-${id}`, null);
    const [cooldown, setCooldown] = useState(0);

    const { fetchAllUserTasks, isLoading, error } = useHabiticaApi();
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const foundCard = cards.find(c => c.id === id);
        if (foundCard) {
            setCard(foundCard);
        } else {
            navigate('/my-bingos');
        }
    }, [id, cards, navigate]);
    
    useEffect(() => {
        if (!lastSync) return;
        const tenMinutes = 10 * 60 * 1000;
        const interval = setInterval(() => {
            const now = Date.now();
            const timePassed = now - lastSync;
            if (timePassed >= tenMinutes) {
                setCooldown(0);
                clearInterval(interval);
            } else {
                setCooldown(tenMinutes - timePassed);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastSync]);


    const updateCardInStorage = useCallback((updatedCard: BingoCard) => {
        setCards(prevCards => prevCards.map(c => c.id === id ? updatedCard : c));
    }, [id, setCards]);

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        if (!card || !card.isGameStarted) return;
        const newGrid = card.grid.map(r => [...r]);
        const cell = newGrid[rowIndex][colIndex];
        if (cell && !cell.isUnavailable) {
            cell.manuallyCompleted = !cell.manuallyCompleted;
            const updatedCard = { ...card, grid: newGrid };
            setCard(updatedCard);
            updateCardInStorage(updatedCard);
        }
    };
    
    const handleSync = async () => {
        if (!card || cooldown > 0 || isLoading) return;
        const allTasks = await fetchAllUserTasks();

        if (allTasks.length === 0 && error) {
            alert(`Failed to sync with Habitica: ${error}. Please check your credentials.`);
            return;
        }

        const allTasksMap = new Map(allTasks.map(t => [t.id, t]));

        const newGrid = card.grid.map(row => row.map(cell => {
            if (!cell) return null;
            const updatedTask = allTasksMap.get(cell.task.id);
            if (updatedTask) {
                 // Task exists, update its data
                 return { ...cell, task: updatedTask, isUnavailable: false };
            } else {
                // Task not found in API response, assume it's completed and cleared.
                // We keep the old task text but mark it as completed.
                const completedTask = { ...cell.task, completed: true };
                return { ...cell, task: completedTask, isUnavailable: false };
            }
        }));

        const updatedCard = { ...card, grid: newGrid };
        setCard(updatedCard);
        updateCardInStorage(updatedCard);
        setLastSync(Date.now());
    };

    const startGame = () => {
        if (!card) return;
        const updatedCard = { ...card, isGameStarted: true };
        setCard(updatedCard);
        updateCardInStorage(updatedCard);
    };

    const downloadAsImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current, { backgroundColor: '#4C2A85' }).then(canvas => {
                const link = document.createElement('a');
                link.download = `${card?.title.replace(/\s+/g, '_') || 'bingo-card'}.png`;
                link.href = canvas.toDataURL();
                link.click();
            });
        }
    };

    if (!card) {
        return <div className="text-center">Loading bingo card...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center text-white">{card.title}</h1>
            <p className="text-center text-habitica-text-secondary mb-6">
                Created on {new Date(card.createdAt).toLocaleDateString()}
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
                 {!card.isGameStarted ? (
                    <button onClick={startGame} className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        <PlayIcon className="w-5 h-5 mr-2" /> Start Filling
                    </button>
                ) : (
                    <button onClick={handleSync} disabled={isLoading || cooldown > 0} className="flex items-center justify-center bg-habitica-light hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                        <RefreshIcon className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Syncing...' : (cooldown > 0 ? `Sync in ${Math.ceil(cooldown / 1000)}s` : 'Update from Habitica')}
                    </button>
                )}
                 <button onClick={downloadAsImage} className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <DownloadIcon className="w-5 h-5 mr-2" /> Download Image
                </button>
            </div>
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4 text-center">Last Sync Failed: {error}</p>}

            <div ref={gridRef} className="p-4 bg-habitica-main rounded-lg">
                <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${card.size}, minmax(0, 1fr))` }}
                >
                    {card.grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <BingoCell 
                                key={`${rowIndex}-${colIndex}`} 
                                cell={cell}
                                isGameStarted={card.isGameStarted} 
                                onClick={() => handleCellClick(rowIndex, colIndex)} 
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BingoGame;