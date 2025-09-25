import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/jobs/employer/my-jobs?limit=20');
        if (!mounted) return;
        setJobs(res.data?.data?.jobs || []);
      } catch (e) {
        if (!mounted) return;
        setError('Failed to load jobs');
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="container">
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>My Jobs</h2>
        <Link className="btn primary" to="/jobs/new">Post Job</Link>
      </div>
      <div className="mt-16 list">
        {loading && <div className="card">Loading…</div>}
        {error && <div className="card error">{error}</div>}
        {!loading && jobs.length === 0 && <div className="card">No jobs yet. <Link to="/jobs/new">Post one</Link>.</div>}
        {jobs.map((j) => (
          <div key={j._id} className="card">
            <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{j.title}</div>
                <div className="muted">{j.company} • {j.category} • {j.location?.city}, {j.location?.state}</div>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <span className="chip">{j.status}</span>
                <select
                  value={j.status}
                  onChange={async (e) => {
                    try {
                      const next = e.target.value;
                      await api.put(`/jobs/${j._id}`, { status: next });
                      setJobs((list) => list.map((x) => x._id === j._id ? { ...x, status: next } : x));
                    } catch (err) {
                      alert(err?.response?.data?.message || 'Failed to update status');
                    }
                  }}
                >
                  <option value="draft">draft</option>
                  <option value="active">active</option>
                  <option value="paused">paused</option>
                  <option value="expired">expired</option>
                  <option value="filled">filled</option>
                </select>
                <Link className="btn ghost" to={`/jobs/${j._id}/applications`}>Applications ({j.applicationsCount || 0})</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
