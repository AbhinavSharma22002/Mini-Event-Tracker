import React from 'react';

export default function EventList({ events, onDelete }) {
  if (!events || events.length === 0) return <div>No events yet.</div>;
  return (
    <div className="event-list">
      {events.map(ev => (
        <div key={ev._id} className="event-card">
          <h3>{ev.title}</h3>
          <div className="muted">{new Date(ev.dateTime).toLocaleString()}</div>
          <div>{ev.location}</div>
          <p>{ev.description}</p>
          <div className="event-actions">
            {ev.shareEnabled && <a target="_blank" rel="noreferrer" href={`/share/${ev.shareId}`}>Public Link</a>}
            <button onClick={() => onDelete(ev._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
