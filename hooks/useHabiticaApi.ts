import { useState, useCallback } from 'react';
import type { HabiticaTask, HabiticaUser } from '../types';
import useLocalStorage from './useLocalStorage';

const API_BASE_URL = 'https://habitica.com/api/v3';

// Helper to map tasks from any API response
const processTasks = (data: any[]): HabiticaTask[] => {
    return data
        // We might get all task types, so let's ensure we only map valid ones
        .filter(task => task.type === 'todo' || task.type === 'daily' || task.type === 'habit')
        .map(task => ({
            id: task.id,
            text: task.text,
            type: task.type,
            completed: task.completed,
            notes: task.notes,
        }));
};


export const useHabiticaApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user] = useLocalStorage<HabiticaUser | null>('habitica-user', null);

    const getHeaders = useCallback(() => {
        if (!user?.userId || !user?.apiToken) {
            throw new Error("User ID and API Token are not set in Profile.");
        }
        return {
            'Content-Type': 'application/json',
            'x-api-user': user.userId,
            'x-api-key': user.apiToken,
            'x-client': `${user.userId}-HabiticaBingo`,
        };
    }, [user]);

    /**
     * Fetches only the user's incomplete To-Dos.
     * Ideal for the bingo creation screen.
     */
    const fetchAvailableTodos = useCallback(async (): Promise<HabiticaTask[]> => {
        setIsLoading(true);
        setError(null);
        try {
            const headers = getHeaders();
            // Fetch only incomplete todos
            const response = await fetch(`${API_BASE_URL}/tasks/user?type=todos`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API Error: ${response.status}`);
            }

            const result = await response.json();
            setIsLoading(false);
            return processTasks(result.data);
        } catch (err: any) {
            console.error("Failed to fetch Habitica todos:", err);
            setError(err.message);
            setIsLoading(false);
            return [];
        }
    }, [getHeaders]);

    /**
     * Fetches all user tasks (todos, dailies, habits) regardless of completion status.
     * Used for syncing game state, as we need to know about completed tasks too.
     */
    const fetchAllUserTasks = useCallback(async (): Promise<HabiticaTask[]> => {
        setIsLoading(true);
        setError(null);
        try {
            const headers = getHeaders();
            // Fetch all task types to get a complete status picture
            const response = await fetch(`${API_BASE_URL}/tasks/user`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API Error: ${response.status}`);
            }

            const result = await response.json();
            setIsLoading(false);
            return processTasks(result.data);
        } catch (err: any) {
            console.error("Failed to fetch all Habitica tasks:", err);
            setError(err.message);
            setIsLoading(false);
            return [];
        }
    }, [getHeaders]);

    return { fetchAvailableTodos, fetchAllUserTasks, isLoading, error };
};