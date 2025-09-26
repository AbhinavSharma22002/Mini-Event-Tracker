import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Nav() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }
  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/">Mini Event Tracker</Link>
      </div>
      <div className="nav-right">
        {token ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/create">Create</Link>
            <button className="linkish" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
