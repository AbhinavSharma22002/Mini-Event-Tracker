import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function EventViewPublic() {
  const { shareId } = useParams();
  const [ev, setEv] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE || 'http://localhost:4000/api'}/events/share/public/${shareId}`);
        setEv(res.data);
      } catch (err) {
        setErr(err.response?.data?.message || 'Not found');
      }
    }
    load();
  }, [shareId]);

  if (err) return <div className="card"><h3>{err}</h3></div>;
  if (!ev) return <div>Loading...</div>;

  return (
    <div className="card">
      <h2>{ev.title}</h2>
      <div className="muted">{new Date(ev.dateTime).toLocaleString()}</div>
      <div>{ev.location}</div>
      <p>{ev.description}</p>
    </div>
  );
}
