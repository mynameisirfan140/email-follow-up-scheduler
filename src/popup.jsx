import React, { useState, useEffect } from 'react';
import './styles.css';

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function ScheduleForm({ onSubmit }) {
  const [subject, setSubject] = useState('');
  const [recipient, setRecipient] = useState('');
  const [delay, setDelay] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'delay') {
      setDelay(value);
    } else {
      setSubject(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          recipient,
          delay: parseInt(delay, 10) || 0,
        }),
      });
      onSubmit();
      setSubject('');
      setRecipient('');
      setDelay('');
      showToast('Reminder scheduled successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to schedule reminder', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="schedule-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Schedule Follow‑up</h2>
      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <div className="form-group">
        <label htmlFor="recipient">Recipient</label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <div className="form-group">
        <label htmlFor="delay">Delay (minutes)</label>
        <input
          id="delay"
          type="number"
          min="0"
          value={delay}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <button type="submit" className="btn primary" disabled={loading}>
        {loading ? 'Scheduling...' : 'Schedule'}
      </button>
    </form>
  );
}

function ReminderList({ schedules }) {
  const [filtered, setFiltered] = useState(schedules);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setFiltered(schedules.filter((s) => s.subject.toLowerCase().includes(term) || s.recipient.toLowerCase().includes(term)));
  };

  return (
    <div className="reminder-list">
      <input
        type="text"
        placeholder="Search reminders..."
        onChange={handleSearch}
        className="search-input"
        aria-label="Search scheduled follow‑ups"
      />
      {filtered.length === 0 ? (
        <p className="empty-state">No scheduled reminders found.</p>
      ) : (
        <ul className="list">
          {filtered.map((schedule) => (
            <li key={schedule.id} className="list-item">
              <div className="meta">
                <span className="subject">{schedule.subject}</span>
                <span className="recipient">→ {schedule.recipient}</span>
                <span className="delay">({schedule.delay} min)</span>
              </div>
              <div className="status">{schedule.status}</div>
              <button className="btn secondary" onClick={() => {/* mark as completed */}}>
                Mark Completed
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Popup() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('/api/schedules');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setSchedules(data);
      } catch (err) {
        console.error('Failed to load schedules:', err);
        showToast('Could not load scheduled reminders', 'error');
      }
    };
    fetchSchedules();
  }, []);

  const handleRefresh = () => {
    setSchedules([]);
    fetchSchedules();
  };

  return (
    <div className="popup-container">
      <header className="header">
        <h1 className="app-title">Email Follow‑up Scheduler</h1>
        <p className="tagline">Schedule polite follow‑up reminders directly from your inbox</p>
        <button className="btn secondary" onClick={handleRefresh}>Refresh</button>
      </header>

      <section className="section">
        <ScheduleForm onSubmit={handleRefresh} />
      </section>

      <section className="section">
        <ReminderList schedules={schedules} />
      </section>

      <footer className="footer">
        <p>© 2025 Email Follow‑up Scheduler. All rights reserved.</p>
      </footer>
    </div>
  );
}