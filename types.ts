
export interface HabiticaUser {
  userId: string;
  apiToken: string;
}

export interface HabiticaTask {
  id: string;
  text: string;
  type: 'todo' | 'daily' | 'habit';
  completed: boolean;
  notes?: string;
}

export interface BingoCellData {
  task: HabiticaTask;
  manuallyCompleted: boolean;
  isUnavailable: boolean; 
}

export interface BingoCard {
  id: string;
  title: string;
  size: number;
  grid: (BingoCellData | null)[][];
  createdAt: string;
  isGameStarted: boolean;
}
