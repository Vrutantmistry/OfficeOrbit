import React from 'react';

const EmployeeProfile = ({ user }) => {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#333' }}>
        👤 My Profile
      </h2>

      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0, 184, 148, 0.1)',
        maxWidth: '600px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '36px',
            margin: '0 auto 20px',
            boxShadow: '0 8px 25px rgba(253, 121, 168, 0.3)'
          }}>
            {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
          </div>
          <h3 style={{ fontSize: '24px', margin: '0 0 10px 0', fontWeight: '600' }}>{user.name}</h3>
          <p style={{ color: '#666', margin: 0 }}>@{user.username}</p>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '15px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '16px' }}>📧 Email Address</h4>
            <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>{user.email}</p>
          </div>

          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '15px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '16px' }}>👤 Username</h4>
            <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>@{user.username}</p>
          </div>

          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '15px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '16px' }}>🎭 Role</h4>
            <span style={{
              padding: '8px 16px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
              color: 'white'
            }}>
              {user.role === 'admin' ? '👑 Administrator' : '👤 Employee'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;