// src/components/employee/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import EmployeeOverview from './EmployeeOverview';
import EmployeeTasks from './EmployeeTasks';
import EmployeeProfile from './EmployeeProfile';

const API_URL = 'http://localhost:5000/api';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch tasks assigned to this employee
  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/tasks/employee/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Transform tasks to match frontend format
        const transformedTasks = data.data.map(task => ({
          id: task._id,
          title: task.title,
          description: task.description,
          dueDate: new Date(task.endDate).toISOString().split('T')[0],
          status: task.status,
          priority: task.priority,
          assignedBy: task.assignedBy.name,
          createdAt: task.createdAt,
          completedAt: task.completedAt
        }));
        setTasks(transformedTasks);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch your tasks');
    } finally {
      setLoading(false);
    }
  };

  // Handle task status update
  const handleTaskUpdate = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/tasks/employee/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh tasks to show updated status
        fetchMyTasks();
        return { success: true, message: 'Task status updated successfully!' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, message: 'Failed to update task status' };
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchMyTasks();
  }, []);

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'my-tasks', label: '📝 My Tasks' },
    { id: 'completed', label: '✅ Completed' },
    { id: 'profile', label: '👤 Profile' }
  ];

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Header user={user} onLogout={onLogout} isAdmin={false} />
        <div style={{
          padding: '50px',
          textAlign: 'center',
          color: '#e74c3c',
          fontSize: '18px'
        }}>
          ❌ Error: {error}
          <br />
          <button 
            onClick={() => fetchMyTasks()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#00b894',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Header user={user} onLogout={onLogout} isAdmin={false} />

      {/* Navigation Tabs */}
      <div style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '0'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#00b894',
                border: 'none',
                padding: '16px 24px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                borderBottom: activeTab === tab.id ? 'none' : '3px solid transparent'
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'rgba(0, 184, 148, 0.1)';
                  e.target.style.borderBottom = '3px solid #00b894';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'transparent';
                  e.target.style.borderBottom = '3px solid transparent';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div style={{
          padding: '50px',
          textAlign: 'center',
          color: '#00b894',
          fontSize: '18px'
        }}>
          🔄 Loading your tasks...
        </div>
      )}

      {/* Tab Content */}
      <div style={{ padding: '30px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'overview' && <EmployeeOverview tasks={tasks} user={user} />}
        {activeTab === 'my-tasks' && (
          <EmployeeTasks 
            tasks={tasks.filter(t => t.status === 'pending' || t.status === 'in-progress')} 
            onTaskUpdate={handleTaskUpdate}
          />
        )}
        {activeTab === 'completed' && (
          <EmployeeTasks 
            tasks={tasks.filter(t => t.status === 'completed')} 
            onTaskUpdate={handleTaskUpdate}
          />
        )}
        {activeTab === 'profile' && <EmployeeProfile user={user} />}
      </div>

      {/* No Tasks Message */}
      {!loading && tasks.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          color: '#666'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📝</div>
          <h3 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>No tasks assigned yet</h3>
          <p style={{ margin: 0 }}>Your admin will assign tasks to you soon!</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;