import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function Dashboard() {
  const [stats, setStats] = useState({ jobs: 0, applications: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch my jobs and aggregate basic counts
        const res = await api.get('/jobs/employer/my-jobs?limit=5');
        if (!mounted) return;
        const jobs = res.data?.data?.jobs || [];
        const totalJobs = res.data?.data?.pagination?.totalJobs || jobs.length;
        setStats({ jobs: totalJobs, applications: jobs.reduce((a, j) => a + (j.applicationsCount || 0), 0) });
      } catch (e) {
        if (!mounted) return;
        setError('Failed to load overview');
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Welcome</h2>
        <p className="muted">Post jobs and manage applications. City-based matching ensures your jobs reach the right candidates.</p>
        <div className="mt-16">
          <Link className="btn primary" to="/jobs/new">Post a Job</Link>
          <Link className="btn ghost" to="/jobs" style={{ marginLeft: 8 }}>View My Jobs</Link>
        </div>
      </div>

      <div className="stats mt-24">
        <div className="stat">
          <div className="label">Total Jobs</div>
          <div className="value">{loading ? '—' : stats.jobs}</div>
        </div>
        <div className="stat">
          <div className="label">Total Applications</div>
          <div className="value">{loading ? '—' : stats.applications}</div>
        </div>
      </div>
      {error && <div className="mt-16 error">{error}</div>}
    </div>
  );
}
