import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import type { BingoCard, BingoCellData } from '../types';
import { TrashIcon, CheckCircleIcon } from './icons';

const checkBingoCompletion = (card: BingoCard): boolean => {
    const size = card.size;
    const grid = card.grid;

    const isCellComplete = (cell: BingoCellData | null): boolean => {
        if (!cell) return false;
        return cell.task.completed || cell.manuallyCompleted;
    };

    // Check rows
    for (let i = 0; i < size; i++) {
        if (grid[i].every(isCellComplete)) return true;
    }

    // Check columns
    for (let j = 0; j < size; j++) {
        let colComplete = true;
        for (let i = 0; i < size; i++) {
            if (!isCellComplete(grid[i][j])) {
                colComplete = false;
                break;
            }
        }
        if (colComplete) return true;
    }

    // Check diagonals
    let diag1Complete = true;
    let diag2Complete = true;
    for (let i = 0; i < size; i++) {
        if (!isCellComplete(grid[i][i])) diag1Complete = false;
        if (!isCellComplete(grid[i][size - 1 - i])) diag2Complete = false;
    }
    if (diag1Complete || diag2Complete) return true;

    return false;
};


const MyBingos: React.FC = () => {
  const [cards, setCards] = useLocalStorage<BingoCard[]>('bingo-cards', []);
  const navigate = useNavigate();

  const deleteCard = (id: string) => {
    // Removed window.confirm as requested for simplicity.
    setCards(prevCards => prevCards.filter(card => card.id !== id));
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-habitica-light">My Bingo Cards</h1>
      {cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => {
            const isDone = checkBingoCompletion(card);
            return (
              <div 
                key={card.id} 
                className="bg-habitica-dark p-4 rounded-lg shadow-lg flex flex-col justify-between hover:bg-[#3b2a5e] transition-colors"
              >
                <div>
                  <h2 className="text-xl font-bold truncate text-white">{card.title}</h2>
                  <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-habitica-text-secondary">
                          {card.size}x{card.size} Grid
                      </p>
                      {isDone ? (
                          <span className="flex items-center text-xs font-semibold text-green-300 bg-green-900/50 px-2 py-0.5 rounded-full">
                              <CheckCircleIcon className="w-4 h-4 mr-1" />
                              Done
                          </span>
                      ) : (
                          <span className="text-xs font-semibold text-yellow-300 bg-yellow-900/50 px-2 py-0.5 rounded-full">
                              Active
                          </span>
                      )}
                  </div>
                  <p className="text-xs text-habitica-text-secondary mt-1">
                    Created on {new Date(card.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                   <button 
                    onClick={() => navigate(`/game/${card.id}`)}
                    className="bg-habitica-light hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm w-full mr-2"
                   >
                    View Card
                  </button>
                  <button 
                    onClick={() => deleteCard(card.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                    aria-label="Delete card"
                   >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center bg-habitica-dark p-10 rounded-lg">
          <p className="text-habitica-text-secondary">You haven't created any bingo cards yet.</p>
          <button 
            onClick={() => navigate('/create')}
            className="mt-4 bg-habitica-light hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Create Your First Card
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBingos;