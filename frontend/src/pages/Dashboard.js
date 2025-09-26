import React, { useEffect, useState } from 'react';
import api from '../api';
import EventList from '../components/EventList';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const q = filter === 'all' ? '' : `?filter=${filter}`;
      const res = await api.get(`/events${q}`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filter]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  return (
    <div>
      <h2>Your Events</h2>
      <div className="toolbar">
        <div>
          <label>Filter:</label>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
        <button onClick={() => navigate('/create')}>Create Event</button>
      </div>

      {loading ? <div>Loading...</div> : <EventList events={events} onDelete={handleDelete} />}
    </div>
  );
}
