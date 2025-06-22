// src/App.js
import React, { useState, useEffect } from 'react';
import LoginForm from './components/auth/LoginForm';
import AdminDashboard from './components/admin/AdminDashboard';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import Loading from './components/common/Loading';

// Simple token verification function (replace with your actual logic)
const verifyToken = (token, setUser, setLoading) => {
  try {
    // Mock verification - replace with your actual token verification logic
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && token) {
      setUser(userData);
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  } finally {
    setLoading(false);
  }
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token, setUser, setLoading);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return user.role === 'admin' ? (
    <AdminDashboard user={user} onLogout={handleLogout} />
  ) : (
    <EmployeeDashboard user={user} onLogout={handleLogout} />
  );
};

export default App;