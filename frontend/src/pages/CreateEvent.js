import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [shareEnabled, setShareEnabled] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (!title || !dateTime) { setErr('Title and date/time required'); return; }
    try {
      await api.post('/events', { title, dateTime, location, description, shareEnabled });
      navigate('/');
    } catch (err) {
      setErr(err.response?.data?.message || 'Failed to create event');
    }
  }

  return (
    <div className="card">
      <h2>Create Event</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <label>Title</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} required />
        <label>Date & Time</label>
        <input value={dateTime} onChange={e=>setDateTime(e.target.value)} type="datetime-local" required />
        <label>Location</label>
        <input value={location} onChange={e=>setLocation(e.target.value)} />
        <label>Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} />
              <div>
                  <label>
                      <input
                          type="checkbox"
                          checked={shareEnabled}
                          onChange={e => setShareEnabled(e.target.checked)}
                      />
                      Enable public share link
                  </label>
              </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
