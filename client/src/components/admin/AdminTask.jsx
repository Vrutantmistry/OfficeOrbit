import React, { useState } from 'react';

const AdminTasks = ({ tasks, onUpdateTask }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleStatusChange = async (taskId, newStatus) => {
    if (onUpdateTask) {
      const result = await onUpdateTask(taskId, newStatus);
      if (!result.success) {
        alert(`Error: ${result.message}`);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#00b894';
      case 'in-progress': return '#0984e3';
      case 'pending': return '#fdcb6e';
      default: return '#74b9ff';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e17055';
      case 'medium': return '#fdcb6e';
      case 'low': return '#00b894';
      default: return '#74b9ff';
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#333' }}>
        📋 Task Management ({tasks.length} total)
      </h2>

      {/* Filters and Controls */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '20px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#666' }}>Filter:</span>
          {['all', 'pending', 'in-progress', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                background: filter === status ? '#667eea' : '#f1f3f4',
                color: filter === status ? 'white' : '#666',
                transition: 'all 0.2s ease'
              }}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#666' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}>
        {sortedTasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '50px',
            color: '#666',
            fontSize: '16px'
          }}>
            📝 No tasks found for the selected filter.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {sortedTasks.map(task => (
              <div key={task.id} style={{
                padding: '25px',
                background: '#f8f9fa',
                borderRadius: '15px',
                borderLeft: `5px solid ${getPriorityColor(task.priority)}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                      {task.title}
                    </h4>
                    
                    {task.description && (
                      <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                        {task.description}
                      </p>
                    )}
                    
                    <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
                      👤 Assigned to: <strong>{task.assignedTo}</strong> • 📅 Due: <strong>{task.dueDate}</strong>
                    </p>
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: getStatusColor(task.status),
                        color: 'white'
                      }}>
                        ● {task.status}
                      </span>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: getPriorityColor(task.priority),
                        color: 'white'
                      }}>
                        🔥 {task.priority} priority
                      </span>
                    </div>

                    {/* Status Update Buttons */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['pending', 'in-progress', 'completed'].map(status => (
                        task.status !== status && (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(task.id, status)}
                            style={{
                              padding: '6px 12px',
                              border: `1px solid ${getStatusColor(status)}`,
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: 'white',
                              color: getStatusColor(status),
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = getStatusColor(status);
                              e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = 'white';
                              e.target.style.color = getStatusColor(status);
                            }}
                          >
                            Mark as {status}
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTasks;