import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const isActive = (p) => pathname === p ? { color: '#8b5cf6' } : undefined;

  return (
    <div className="navbar">
      <div className="inner">
        <div>
          <span className="brand">happyjobs</span>
          <span style={{ marginLeft: 12, fontWeight: 700 }}>| Employer</span>
          <Link to="/" style={{ marginLeft: 18, ...isActive('/') }}>Dashboard</Link>
          <Link to="/jobs" style={isActive('/jobs')}>My Jobs</Link>
          <Link to="/jobs/new" style={isActive('/jobs/new')}>Post Job</Link>
        </div>
        <div>
          <span className="chip" style={{ marginRight: 8 }}>{user?.companyName || user?.fullName || 'Employer'}</span>
          <button className="btn ghost" onClick={() => { logout(); nav('/login'); }}>Logout</button>
        </div>
      </div>
    </div>
  );
}
