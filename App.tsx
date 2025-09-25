
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import CreateBingo from './components/CreateBingo';
import MyBingos from './components/MyBingos';
import BingoGame from './components/BingoGame';
import About from './components/About';
import useLocalStorage from './hooks/useLocalStorage';
import type { HabiticaUser } from './types';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user] = useLocalStorage<HabiticaUser | null>('habitica-user', null);

  return (
    <div className="min-h-screen bg-habitica-main">
      <Navbar />
      <main className="container mx-auto p-4 md:p-6">
        <Routes>
          <Route path="/" element={user?.userId && user.apiToken ? <Navigate to="/my-bingos" /> : <Navigate to="/profile" />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <CreateBingo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bingos" 
            element={
              <ProtectedRoute>
                <MyBingos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/game/:id" 
            element={
              <ProtectedRoute>
                <BingoGame />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
