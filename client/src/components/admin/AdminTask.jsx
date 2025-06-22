import React from 'react';

const AdminTasks = ({ tasks }) => {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#333' }}>
        📋 Task Management
      </h2>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {tasks.map(task => (
            <div key={task.id} style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '15px',
              borderLeft: `4px solid ${task.priority === 'high' ? '#e17055' : task.priority === 'medium' ? '#fdcb6e' : '#00b894'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600' }}>{task.title}</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                    Assigned to: {task.assignedTo} • Due: {task.dueDate}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: task.priority === 'high' ? '#e17055' : task.priority === 'medium' ? '#fdcb6e' : '#00b894',
                      color: 'white'
                    }}>
                      {task.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;