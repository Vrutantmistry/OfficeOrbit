// src/utils/helpers.js
const API_URL = 'http://localhost:5000/api';

export const getFirstName = (fullName) => {
  return fullName ? fullName.split(' ')[0] : 'User';
};

export const getUserInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getGreeting = () => {
  const currentTime = new Date().getHours();
  return currentTime < 12 ? 'Good Morning' : currentTime < 18 ? 'Good Afternoon' : 'Good Evening';
};

export const verifyToken = async (token, setUser, setLoading) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      setUser(data.user);
    } else {
      localStorage.removeItem('token');
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    localStorage.removeItem('token');
  } finally {
    setLoading(false);
  }
};

export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};