// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import AdminOverview from './AdminOverview';
import AdminEmployees from './AdminEmployees';
import AdminTasks from './AdminTask';
import AdminCreateTask from './AdminCreateTask';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/tasks/admin/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setEmployees(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/tasks/admin/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Transform tasks to match frontend format with null checks
        const transformedTasks = data.data.map(task => ({
          id: task._id,
          title: task.title,
          description: task.description,
          // ✅ Fixed: Add null checks for assignedTo
          assignedTo: task.assignedTo?.name || 'Unassigned',
          assignedToId: task.assignedTo?._id || null,
          dueDate: new Date(task.endDate).toISOString().split('T')[0],
          status: task.status,
          priority: task.priority,
          createdAt: task.createdAt
        }));
        setTasks(transformedTasks);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  // Handle task creation
  const handleTaskCreated = async (newTaskData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/tasks/admin/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTaskData.title,
          description: newTaskData.description,
          assignedTo: newTaskData.assignedTo,
          endDate: newTaskData.dueDate,
          priority: newTaskData.priority
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh tasks and employees to update counts
        fetchTasks();
        fetchEmployees();
        return { success: true, message: 'Task created successfully!' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, message: 'Failed to create task' };
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
        // Refresh tasks and employees
        fetchTasks();
        fetchEmployees();
        return { success: true, message: 'Task updated successfully!' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, message: 'Failed to update task' };
    }
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'employees', label: '👥 Employees' },
    { id: 'tasks', label: '📋 Tasks' },
    { id: 'create-task', label: '➕ Create Task' }
  ];

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Header user={user} onLogout={onLogout} isAdmin={true} />
        <div style={{
          padding: '50px',
          textAlign: 'center',
          color: '#e74c3c',
          fontSize: '18px'
        }}>
          ❌ Error: {error}
          <br />
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#667eea',
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
      <Header user={user} onLogout={onLogout} isAdmin={true} />

      {/* Navigation Tabs */}
      <div style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          gap: '0'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#667eea',
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
                  e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                  e.target.style.borderBottom = '3px solid #667eea';
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
          color: '#667eea',
          fontSize: '18px'
        }}>
          🔄 Loading data from MongoDB...
        </div>
      )}

      {/* Tab Content */}
      <div style={{ padding: '30px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        {activeTab === 'overview' && <AdminOverview employees={employees} tasks={tasks} />}
        {activeTab === 'employees' && <AdminEmployees employees={employees} />}
        {activeTab === 'tasks' && <AdminTasks tasks={tasks} onUpdateTask={handleTaskUpdate} />}
        {activeTab === 'create-task' && <AdminCreateTask employees={employees} onTaskCreated={handleTaskCreated} />}
      </div>
    </div>
  );
};

export default AdminDashboard;