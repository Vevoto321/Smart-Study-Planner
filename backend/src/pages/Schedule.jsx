import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleAPI, authAPI } from '../api';
import { Calendar, Clock, CheckCircle, Plus, Trash2, Home } from 'lucide-react';

function Schedule() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    days: 7,
    topics: [{ name: '', duration: 60, priority: 'medium' }],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    if (userId) {
      loadSchedules();
    }
  }, [userId]);

  const checkAuth = async () => {
    try {
      await authAPI.verify();
    } catch (error) {
      navigate('/');
    }
  };

  const loadSchedules = async () => {
    try {
      const response = await scheduleAPI.getByUser(userId);
      setSchedules(response.data);
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  const addTopic = () => {
    setFormData({
      ...formData,
      topics: [...formData.topics, { name: '', duration: 60, priority: 'medium' }],
    });
  };

  const updateTopic = (index, field, value) => {
    const newTopics = [...formData.topics];
    newTopics[index][field] = value;
    setFormData({ ...formData, topics: newTopics });
  };

  const removeTopic = (index) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((_, i) => i !== index),
    });
  };

  const generateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await scheduleAPI.generate({ ...formData, userId });
      setShowForm(false);
      setFormData({
        subject: '',
        days: 7,
        topics: [{ name: '', duration: 60, priority: 'medium' }],
      });
      loadSchedules();
    } catch (error) {
      console.error('Error generating schedule:', error);
      alert('Failed to generate schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (scheduleId, dayIndex, taskIndex, completed) => {
    try {
      await scheduleAPI.updateTask(scheduleId, dayIndex, taskIndex, { completed });
      loadSchedules();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteSchedule = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await scheduleAPI.delete(id);
        loadSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  return (
    <div className="schedule-page">
      <header className="page-header">
        <button onClick={() => navigate('/')} className="back-btn">
          <Home size={20} />
        </button>
        <h1>📅 Study Schedules</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          <Plus size={20} />
          New Schedule
        </button>
      </header>

      {showForm && (
        <div className="form-card">
          <h2>Create AI Study Schedule</h2>
          <form onSubmit={generateSchedule}>
            <input
              type="text"
              placeholder="Subject (e.g., Mathematics)"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Number of days"
              value={formData.days}
              onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
              min="1"
              max="30"
              required
            />
            <div className="topics-section">
              <h3>Topics</h3>
              {formData.topics.map((topic, index) => (
                <div key={index} className="topic-row">
                  <input
                    type="text"
                    placeholder="Topic name"
                    value={topic.name}
                    onChange={(e) => updateTopic(index, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Duration (min)"
                    value={topic.duration}
                    onChange={(e) => updateTopic(index, 'duration', parseInt(e.target.value))}
                    min="15"
                    required
                  />
                  <select
                    value={topic.priority}
                    onChange={(e) => updateTopic(index, 'priority', e.target.value)}
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <button type="button" onClick={() => removeTopic(index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTopic} className="add-topic-btn">
                <Plus size={16} /> Add Topic
              </button>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="schedules-list">
        {schedules.map((schedule) => (
          <div key={schedule._id} className="schedule-card">
            <div className="schedule-header">
              <h3>{schedule.subject}</h3>
              <button onClick={() => deleteSchedule(schedule._id)} className="delete-btn">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="schedule-content">
              {schedule.schedule.map((day, dayIndex) => (
                <div key={dayIndex} className="day-card">
                  <h4>{day.day} - {new Date(day.date).toLocaleDateString()}</h4>
                  {day.tasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`task-item ${task.completed ? 'completed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => toggleTask(schedule._id, dayIndex, taskIndex, e.target.checked)}
                      />
                      <div className="task-info">
                        <span className="task-topic">{task.topic}</span>
                        <span className="task-time">
                          <Clock size={14} />
                          {task.startTime} - {task.endTime}
                        </span>
                      </div>
                      {task.completed && <CheckCircle size={18} className="check-icon" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule;
