// src/components/employee/EmployeeTasks.jsx
import React, { useState } from 'react';

const EmployeeTasks = ({ tasks, onTaskUpdate }) => {
  const [updatingTasks, setUpdatingTasks] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleToggleTask = async (taskId, currentStatus) => {
    // Determine new status
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    setUpdatingTasks(prev => ({ ...prev, [taskId]: true }));
    setMessage({ type: '', text: '' });

    try {
      const result = await onTaskUpdate(taskId, newStatus);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: result.message 
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message 
        });
      }
    } catch (error) {
      console.error('Task update error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to update task status' 
      });
    } finally {
      setUpdatingTasks(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    if (newStatus === tasks.find(t => t.id === taskId)?.status) return;
    
    setUpdatingTasks(prev => ({ ...prev, [taskId]: true }));
    setMessage({ type: '', text: '' });

    try {
      const result = await onTaskUpdate(taskId, newStatus);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: result.message 
        });
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message 
        });
      }
    } catch (error) {
      console.error('Task update error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to update task status' 
      });
    } finally {
      setUpdatingTasks(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e17055';
      case 'medium': return '#fdcb6e';
      case 'low': return '#00b894';
      default: return '#00b894';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#00b894';
      case 'in-progress': return '#fdcb6e';
      case 'pending': return '#fd79a8';
      default: return '#fd79a8';
    }
  };

  return (
    <div>
      {/* Message Display */}
      {message.text && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '14px',
          background: message.type === 'success' ? '#e8f5e8' : '#ffebee',
          color: message.type === 'success' ? '#2e7d32' : '#c62828',
          border: `1px solid ${message.type === 'success' ? '#c8e6c9' : '#ffcdd2'}`
        }}>
          {message.type === 'success' ? '✅ ' : '❌ '}{message.text}
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {tasks.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '60px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📝</div>
            <h3 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#333' }}>No tasks found</h3>
            <p style={{ color: '#666', margin: 0 }}>You're all caught up! Great job! 🎉</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{
              background: 'white',
              padding: '25px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0, 184, 148, 0.1)',
              borderLeft: `4px solid ${getPriorityColor(task.priority)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <h4 style={{ margin: '0', fontSize: '20px', fontWeight: '600' }}>{task.title}</h4>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: getStatusColor(task.status),
                      color: 'white',
                      textTransform: 'capitalize'
                    }}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                      {task.description}
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      📅 Due: {task.dueDate}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: getPriorityColor(task.priority),
                      color: 'white'
                    }}>
                      {task.priority} priority
                    </span>
                    {task.assignedBy && (
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        👤 By: {task.assignedBy}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Status Change Dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      disabled={updatingTasks[task.id]}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '20px',
                        border: '2px solid #e9ecef',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: updatingTasks[task.id] ? 'not-allowed' : 'pointer',
                        opacity: updatingTasks[task.id] ? 0.6 : 1
                      }}
                    >
                      <option value="pending">📋 Pending</option>
                      <option value="in-progress">⏳ In Progress</option>
                      <option value="completed">✅ Completed</option>
                    </select>

                    {/* Quick Toggle Button */}
                    <button
                      onClick={() => handleToggleTask(task.id, task.status)}
                      disabled={updatingTasks[task.id]}
                      style={{
                        background: task.status === 'completed' 
                          ? 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)' 
                          : 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: updatingTasks[task.id] ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'transform 0.3s',
                        opacity: updatingTasks[task.id] ? 0.6 : 1
                      }}
                      onMouseOver={(e) => {
                        if (!updatingTasks[task.id]) {
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!updatingTasks[task.id]) {
                          e.target.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {updatingTasks[task.id] 
                        ? '⏳ Updating...' 
                        : task.status === 'completed' 
                          ? '📋 Mark Pending' 
                          : '✅ Mark Complete'
                      }
                    </button>
                  </div>

                  {/* Show completion time */}
                  {task.status === 'completed' && task.completedAt && (
                    <div style={{ 
                      marginTop: '10px', 
                      fontSize: '12px', 
                      color: '#00b894',
                      fontStyle: 'italic'
                    }}>
                      ✅ Completed on {new Date(task.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeTasks;