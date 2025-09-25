
import React from 'react';
import { Navigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import type { HabiticaUser } from '../types';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const [user] = useLocalStorage<HabiticaUser | null>('habitica-user', null);

  if (!user || !user.userId || !user.apiToken) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
