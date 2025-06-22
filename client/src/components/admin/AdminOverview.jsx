import React from 'react';

const AdminOverview = ({ employees, tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#333' }}>
        📊 Admin Overview
      </h2>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
        }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', opacity: 0.9 }}>👥 Total Employees</h3>
          <p style={{ fontSize: '32px', margin: '0', fontWeight: '700' }}>{employees.length}</p>
        </div>

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
          background: 'linear-gradient(135deg, #e17055 0%, #fdcb6e 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(225, 112, 85, 0.3)'
        }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', opacity: 0.9 }}>🔥 High Priority</h3>
          <p style={{ fontSize: '32px', margin: '0', fontWeight: '700' }}>{highPriorityTasks}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
          📈 Recent Activity
        </h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {tasks.slice(0, 3).map(task => (
            <div key={task.id} style={{
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '10px',
              borderLeft: `4px solid ${task.priority === 'high' ? '#e17055' : task.priority === 'medium' ? '#fdcb6e' : '#00b894'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>{task.title}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Assigned to: {task.assignedTo}</p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: task.status === 'completed' ? '#00b894' : '#fdcb6e',
                  color: 'white'
                }}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;