import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FanDashboardPage from './pages/FanDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PlayerDashboardPage from './pages/PlayerDashboardPage';
import CoachDashboardPage from './pages/CoachDashboardPage';
import SetupPasswordPage from './pages/SetupPasswordPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRole={['Fan', 'Admin']}>
              <FanDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route 
          path="/player" 
          element={
            <ProtectedRoute allowedRole={['Player', 'Admin']}>
              <PlayerDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coach" 
          element={
            <ProtectedRoute allowedRole={['Coach', 'Admin']}>
              <CoachDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/setup-password" element={<SetupPasswordPage />} />
      </Routes>
    </Router>
  );
}

