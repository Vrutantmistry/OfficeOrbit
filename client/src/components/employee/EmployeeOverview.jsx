import React from 'react';

const EmployeeOverview = ({ tasks, user }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#333' }}>
        📊 My Overview
      </h2>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0, 184, 148, 0.3)'
        }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', opacity: 0.9 }}>📋 Total Tasks</h3>
          <p style={{ fontSize: '32px', margin: '0', fontWeight: '700' }}>{totalTasks}</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(253, 121, 168, 0.3)'
        }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', opacity: 0.9 }}>✅ Completed</h3>
          <p style={{ fontSize: '32px', margin: '0', fontWeight: '700' }}>{completedTasks}</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(253, 203, 110, 0.3)'
        }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', opacity: 0.9 }}>⏳ Pending</h3>
          <p style={{ fontSize: '32px', margin: '0', fontWeight: '700' }}>{pendingTasks}</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #e17055 0%, #fd79a8 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(225, 112, 85, 0.3)'
        }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', opacity: 0.9 }}>🔥 High Priority</h3>
          <p style={{ fontSize: '32px', margin: '0', fontWeight: '700' }}>{highPriorityTasks}</p>
        </div>
      </div>

      {/* Progress */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0, 184, 148, 0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
          📈 Your Progress
        </h3>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </div>
          <div style={{ fontSize: '16px', color: '#666' }}>
            Task Completion Rate
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOverview;