// src/components/common/Header.jsx
import React from 'react';

// Helper functions moved inline
const getUserInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Header = ({ user, onLogout, isAdmin = false }) => {
  const greeting = getGreeting();
  const firstName = user.name ? user.name.split(' ')[0] : 'User';
  const userInitials = getUserInitials(user.name);

  const headerBg = isAdmin 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';

  const shadowColor = isAdmin 
    ? 'rgba(102, 126, 234, 0.3)'
    : 'rgba(0, 184, 148, 0.3)';

  return (
    <header style={{
      background: headerBg,
      padding: '0',
      boxShadow: `0 4px 20px ${shadowColor}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.3
      }}></div>
      
      <div style={{
        maxWidth: isAdmin ? '1400px' : '1200px',
        margin: '0 auto',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left Side - User Info */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: isAdmin 
              ? 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)'
              : 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            border: '3px solid rgba(255,255,255,0.3)',
            marginRight: '20px'
          }}>
            {userInitials}
          </div>
          
          <div>
            <h1 style={{ 
              margin: '0 0 5px 0', 
              color: 'white', 
              fontSize: '28px', 
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {greeting}, {firstName}! {isAdmin ? '👑' : '💼'}
            </h1>
            <p style={{ 
              margin: 0, 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '16px',
              fontWeight: '400'
            }}>
              {isAdmin ? 'Administrator' : 'Employee'} Dashboard • @{user.username}
            </p>
          </div>
        </div>

        {/* Right Side - User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            {isAdmin ? '👑 Admin' : '👤 Employee'}
          </div>
          
          <button onClick={onLogout} style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '12px 20px',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
            e.target.style.transform = 'translateY(0)';
          }}>
            🚪 Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;