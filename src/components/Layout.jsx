import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/jobs', label: 'My Jobs' },
    { to: '/jobs/new', label: 'Post Job' },
    { to: '/profile', label: 'Company Profile' },
    { to: '/candidates', label: 'Candidates' },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="logo-dot" />
          <div>
            <div className="brand-title">happyjobs</div>
            <div className="brand-sub">Employer</div>
          </div>
        </div>
        <nav className="menu">
          {navItems.map((n) => (
            <Link key={n.to} to={n.to} className={pathname === n.to ? 'menu-link active' : 'menu-link'}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip" title={user?.email}>{user?.companyName || user?.fullName || 'Employer'}</div>
          <button className="btn ghost full" onClick={() => { logout(); nav('/login'); }}>Logout</button>
        </div>
      </aside>
      <main className="content">
        <header className="topbar">
          <div className="crumbs">{navItems.find(n => n.to === pathname)?.label || ''}</div>
          <div className="top-actions">
            <Link to="/jobs/new" className="btn primary">Post Job</Link>
          </div>
        </header>
        <div className="page">{children}</div>
        <footer className="footer">© {new Date().getFullYear()} happyjobs • Made for employers</footer>
      </main>
    </div>
  );
}
