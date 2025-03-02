import React, { useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import ThemeToggleButton from './components/ThemeToggleButton';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import TaskDetails from './pages/TaskDetails';

const App: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const darkMode = useThemeStore((state) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeToggleButton />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
