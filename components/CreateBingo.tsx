import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useHabiticaApi } from '../hooks/useHabiticaApi';
import { shuffleArray } from '../utils/helpers';
import type { BingoCard, HabiticaTask, BingoCellData } from '../types';
import { ShuffleIcon, RefreshIcon } from './icons';

const FIVE_MINUTES = 5 * 60 * 1000;

const CreateBingo: React.FC = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useLocalStorage<BingoCard[]>('bingo-cards', []);
    const { fetchAvailableTodos, isLoading, error } = useHabiticaApi();

    const [title, setTitle] = useState('');
    const [size, setSize] = useState(5);
    const [allTasks, setAllTasks] = useState<HabiticaTask[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<Map<string, HabiticaTask>>(new Map());
    const [gridPreview, setGridPreview] = useState<(HabiticaTask | null)[][]>([]);
    const [swapCandidate, setSwapCandidate] = useState<{ row: number, col: number } | null>(null);
    
    const [lastFetch, setLastFetch] = useState<number>(0);
    const [cooldown, setCooldown] = useState(0);

    const requiredTasks = useMemo(() => size * size, [size]);
    const isReadyForPreview = useMemo(() => selectedTasks.size === requiredTasks, [selectedTasks, requiredTasks]);

    const loadTasks = useCallback(async () => {
        const tasks = await fetchAvailableTodos();
        setAllTasks(tasks);
        setLastFetch(Date.now());
    }, [fetchAvailableTodos]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);
    
    useEffect(() => {
        if (!lastFetch) return;
        const interval = setInterval(() => {
            const timePassed = Date.now() - lastFetch;
            if (timePassed >= FIVE_MINUTES) {
                setCooldown(0);
                clearInterval(interval);
            } else {
                setCooldown(FIVE_MINUTES - timePassed);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastFetch]);

    useEffect(() => {
        if (isReadyForPreview) {
            const tasksForGrid = Array.from(selectedTasks.values());
            const newGrid: (HabiticaTask | null)[][] = [];
            let taskIndex = 0;
            for (let i = 0; i < size; i++) {
                const row: (HabiticaTask | null)[] = [];
                for (let j = 0; j < size; j++) {
                    row.push(tasksForGrid[taskIndex++]);
                }
                newGrid.push(row);
            }
            setGridPreview(newGrid);
        } else {
            setGridPreview([]);
        }
    }, [isReadyForPreview, selectedTasks, size]);

    const handleTaskToggle = (task: HabiticaTask) => {
        const newSelection = new Map(selectedTasks);
        if (newSelection.has(task.id)) {
            newSelection.delete(task.id);
        } else if (newSelection.size < requiredTasks) {
            newSelection.set(task.id, task);
        }
        setSelectedTasks(newSelection);
    };

    const handleRandomizeGrid = () => {
        const flattenedTasks = gridPreview.flat().filter(Boolean) as HabiticaTask[];
        const shuffled = shuffleArray(flattenedTasks);
        const newGrid: (HabiticaTask | null)[][] = [];
        let taskIndex = 0;
        for (let i = 0; i < size; i++) {
            newGrid[i] = [];
            for (let j = 0; j < size; j++) {
                newGrid[i][j] = shuffled[taskIndex++];
            }
        }
        setGridPreview(newGrid);
    };
    
    const handleCellClick = (row: number, col: number) => {
        if (!swapCandidate) {
            setSwapCandidate({ row, col });
        } else {
            const newGrid = gridPreview.map(r => [...r]);
            const task1 = newGrid[swapCandidate.row][swapCandidate.col];
            const task2 = newGrid[row][col];
            newGrid[swapCandidate.row][swapCandidate.col] = task2;
            newGrid[row][col] = task1;
            setGridPreview(newGrid);
            setSwapCandidate(null);
        }
    };
    
    const handleCreateBingo = () => {
        if (cards.length >= 20) {
            alert("You can only have a maximum of 20 bingo cards.");
            return;
        }

        const finalGrid: (BingoCellData | null)[][] = gridPreview.map(row => 
            row.map(task => task ? {
                task,
                manuallyCompleted: false,
                isUnavailable: false,
            } : null)
        );

        const newCard: BingoCard = {
            id: new Date().toISOString(),
            title: title || `Bingo Card #${cards.length + 1}`,
            size,
            grid: finalGrid,
            createdAt: new Date().toISOString(),
            isGameStarted: false,
        };

        setCards([...cards, newCard]);
        navigate(`/game/${newCard.id}`);
    };

    return (
        <div className="max-w-4xl mx-auto bg-habitica-dark p-6 rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-habitica-light">Create a New Bingo Card</h1>
            
            {!isReadyForPreview ? (
                <>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bingo Card Title (optional)" className="w-full bg-[#3b2a5e] border border-habitica-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-habitica-light" />
                        <select value={size} onChange={(e) => {setSize(Number(e.target.value)); setSelectedTasks(new Map())}} className="w-full bg-[#3b2a5e] border border-habitica-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-habitica-light">
                            {[3, 4, 5, 6, 7].map(s => <option key={s} value={s}>{s}x{s} Grid</option>)}
                        </select>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">Select Tasks ({selectedTasks.size} / {requiredTasks})</h2>
                        <button onClick={loadTasks} disabled={isLoading || cooldown > 0} className="flex items-center text-sm bg-habitica-light hover:bg-opacity-80 text-white font-bold py-1 px-3 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                            <RefreshIcon className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            {isLoading ? 'Refreshing...' : (cooldown > 0 ? `Refresh in ${Math.ceil(cooldown / 1000)}s` : 'Refresh List')}
                        </button>
                    </div>
                    {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4">Error: {error}</p>}
                    <div className="bg-[#3b2a5e] p-4 rounded-md h-64 overflow-y-auto border border-habitica-main">
                        {isLoading && allTasks.length === 0 ? <p className="text-center text-habitica-text-secondary">Loading your Habitica tasks...</p> : (
                            <ul className="space-y-2">
                                {allTasks.length > 0 ? allTasks.map(task => (
                                    <li key={task.id} className="flex items-center bg-habitica-main p-2 rounded">
                                        <input type="checkbox" id={`task-${task.id}`} checked={selectedTasks.has(task.id)} onChange={() => handleTaskToggle(task)} disabled={!selectedTasks.has(task.id) && selectedTasks.size >= requiredTasks} className="h-4 w-4 rounded border-gray-300 text-habitica-light focus:ring-habitica-light disabled:opacity-50" />
                                        <label htmlFor={`task-${task.id}`} className="ml-3 block text-sm font-medium text-white select-none">{task.text}</label>
                                    </li>
                                )) : <p className="text-center text-habitica-text-secondary">No incomplete To-Dos found. Check your credentials or create some new tasks in Habitica!</p>}
                            </ul>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-2 text-center">Arrange Your Bingo Card</h2>
                    <p className="text-center text-habitica-text-secondary mb-4">Click two cells to swap their tasks.</p>
                    <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
                        {gridPreview.map((row, rIndex) => row.map((task, cIndex) => (
                            <div key={`${rIndex}-${cIndex}`} onClick={() => handleCellClick(rIndex, cIndex)} className={`bg-habitica-main rounded-md p-2 flex items-center justify-center text-center aspect-square text-xs cursor-pointer transition-all ${swapCandidate && swapCandidate.row === rIndex && swapCandidate.col === cIndex ? 'ring-2 ring-habitica-light scale-105' : 'hover:bg-[#3b2a5e]'}`}>
                                {task?.text}
                            </div>
                        )))}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleRandomizeGrid} className="flex-1 flex items-center justify-center bg-habitica-light hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-md transition-colors">
                            <ShuffleIcon className="w-5 h-5 mr-2" /> Randomize
                        </button>
                        <button onClick={handleCreateBingo} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors">
                            Create Bingo Card
                        </button>
                    </div>
                     <button onClick={() => setSelectedTasks(new Map())} className="mt-4 w-full text-center text-habitica-text-secondary hover:text-white">
                        &larr; Back to Task Selection
                    </button>
                </>
            )}
        </div>
    );
};

export default CreateBingo;