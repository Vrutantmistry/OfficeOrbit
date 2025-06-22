import React from 'react';

const AdminEmployees = ({ employees }) => {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#333' }}>
        👥 Employee Management
      </h2>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {employees.map(employee => (
            <div key={employee.id} style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: '15px'
                }}>
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600' }}>{employee.name}</h4>
                  <p style={{ margin: '0 0 3px 0', fontSize: '14px', color: '#666' }}>@{employee.username}</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{employee.email}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                  {employee.tasksCount} tasks
                </div>
                <div style={{ fontSize: '14px', color: '#00b894' }}>
                  {employee.completedTasks} completed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEmployees;