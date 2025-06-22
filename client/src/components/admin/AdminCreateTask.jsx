// src/components/admin/AdminCreateTask.jsx
import React, { useState } from 'react';

const AdminCreateTask = ({ employees, onTaskCreated }) => {
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value
    });
    // Clear messages when user types
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate form
      if (!taskForm.title || !taskForm.assignedTo || !taskForm.dueDate) {
        setMessage({ 
          type: 'error', 
          text: 'Please fill in all required fields' 
        });
        setLoading(false);
        return;
      }

      // Check if due date is in the future
      const today = new Date();
      const dueDate = new Date(taskForm.dueDate);
      if (dueDate < today) {
        setMessage({ 
          type: 'error', 
          text: 'Due date must be in the future' 
        });
        setLoading(false);
        return;
      }

      // Call the parent function to handle API call
      const result = await onTaskCreated(taskForm);

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: result.message 
        });
        
        // Reset form on success
        setTaskForm({
          title: '',
          description: '',
          assignedTo: '',
          dueDate: '',
          priority: 'medium'
        });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 5000);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message 
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#333' }}>
        ➕ Create New Task
      </h2>

      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        maxWidth: '600px'
      }}>
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

        {/* Employee Count Info */}
        <div style={{
          background: '#e3f2fd',
          color: '#1565c0',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px',
          border: '1px solid #bbdefb'
        }}>
          📋 Available Employees: {employees.length}
          {employees.length === 0 && ' (No employees found - users need to register first)'}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={taskForm.title}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              placeholder="Enter task title"
              required
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Description
            </label>
            <textarea
              name="description"
              value={taskForm.description}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '16px',
                resize: 'vertical',
                minHeight: '100px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter task description"
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Assign To *
            </label>
            <select
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
              disabled={loading || employees.length === 0}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} (@{emp.username}) - {emp.tasksCount} tasks
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
                disabled={loading}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Priority
              </label>
              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                disabled={loading}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || employees.length === 0}
            style={{
              background: loading 
                ? '#ccc' 
                : employees.length === 0 
                  ? '#ccc'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || employees.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => {
              if (!loading && employees.length > 0) {
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading && employees.length > 0) {
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? '⏳ Creating Task...' : '➕ Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateTask;