import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';
import { updateApplicationStatus } from '../services/applications.js';

export default function Applications() {
  const { jobId } = useParams();
  const [data, setData] = useState({ job: null, applications: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});
  const [action, setAction] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get(`/applications/job/${jobId}`);
        if (!mounted) return;
        setData(res.data?.data || { job: null, applications: [] });
      } catch (e) {
        if (!mounted) return;
        setError('Failed to load applications');
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [jobId]);

  return (
    <div className="container">
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Applications {data.job ? `• ${data.job.title} @ ${data.job.company}` : ''}</h2>
      </div>
      <div className="mt-16 list">
        {loading && <div className="card">Loading…</div>}
        {error && <div className="card error">{error}</div>}
        {!loading && data.applications?.length === 0 && <div className="card">No applications yet.</div>}
        {data.applications?.map((a) => (
          <div className="card" key={a._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{a.applicant?.fullName || 'Applicant'}</div>
                <div className="muted">
                  {a.applicant?.location?.city || '—'}{a.applicant?.location?.state ? `, ${a.applicant.location.state}` : ''}
                </div>
                <div className="muted">Status: <span className="chip">{a.status}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={async () => { await logActivity(a._id, 'viewed-contact'); setExpanded((e)=>({ ...e, [a._id]: !e[a._id] })); }}>View Contact</button>
                <button className="btn" onClick={async () => { await logActivity(a._id, 'contacted-whatsapp'); const phone = (a.applicant?.phoneNumber || '').replace(/\D/g,''); if (phone) window.open(`https://wa.me/91${phone}`,'_blank'); }}>WhatsApp</button>
                <button className="btn ghost" disabled={!a.resume?.url} onClick={async () => { await logActivity(a._id, 'downloaded-resume'); if (a.resume?.url) window.open(a.resume.url, '_blank'); }}>Resume</button>
              </div>
            </div>
            {expanded[a._id] && (
              <div style={{ marginTop: 12, borderTop: '1px solid #eee', paddingTop: 12 }}>
                <div className="row wrap" style={{ gap: 12 }}>
                  <div className="col">
                    <label>Move to stage</label>
                    <select value={action[a._id]?.status || ''} onChange={(e)=> setAction((s)=>({ ...s, [a._id]: { ...(s[a._id]||{}), status: e.target.value } }))}>
                      <option value="">Select</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview-scheduled">Interview Scheduled</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  {(action[a._id]?.status === 'interview-scheduled') && (
                    <>
                      <div className="col">
                        <label>Interview Date</label>
                        <input type="date" value={action[a._id]?.date || ''} onChange={(e)=> setAction((s)=>({ ...s, [a._id]: { ...(s[a._id]||{}), date: e.target.value } }))} />
                      </div>
                      <div className="col">
                        <label>Time</label>
                        <input type="time" value={action[a._id]?.time || ''} onChange={(e)=> setAction((s)=>({ ...s, [a._id]: { ...(s[a._id]||{}), time: e.target.value } }))} />
                      </div>
                      <div className="col">
                        <label>Location</label>
                        <input value={action[a._id]?.location || ''} onChange={(e)=> setAction((s)=>({ ...s, [a._id]: { ...(s[a._id]||{}), location: e.target.value } }))} placeholder="Office / Google Meet" />
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-12">
                  <label>Notes / Feedback</label>
                  <textarea placeholder="Add optional comments" value={action[a._id]?.comments || ''} onChange={(e)=> setAction((s)=>({ ...s, [a._id]: { ...(s[a._id]||{}), comments: e.target.value } }))} />
                </div>
                <div className="mt-12 row" style={{ gap: 8 }}>
                  <button className="btn primary" onClick={async ()=>{
                    const act = action[a._id] || {};
                    if (!act.status) return;
                    const payload = {
                      status: act.status,
                      feedback: act.comments ? { comments: act.comments } : undefined,
                      interviewDetails: act.status === 'interview-scheduled' ? { date: act.date, time: act.time, location: act.location, type: 'in-person' } : undefined,
                    };
                    try {
                      await updateApplicationStatus(a._id, payload);
                      const res = await api.get(`/applications/job/${jobId}`);
                      setData(res.data?.data || { job: null, applications: [] });
                    } catch (e) {
                      alert(e?.response?.data?.message || 'Failed to update');
                    }
                  }}>Update</button>
                  <button className="btn ghost" onClick={()=> setAction((s)=> ({ ...s, [a._id]: {} }))}>Reset</button>
                </div>
                <div><strong>Phone:</strong> {a.applicant?.phoneNumber || '—'}</div>
                <div><strong>Email:</strong> {a.applicant?.email || '—'}</div>
                <div style={{ marginTop: 8 }}>
                  <strong>Skills:</strong> {(a.applicant?.skills || []).slice(0,8).join(', ') || '—'}
                </div>
                <div style={{ marginTop: 8 }}>
                  <strong>Experience:</strong> {(a.applicant?.experience || []).length > 0 ? `${a.applicant.experience.length} entries` : '—'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

async function logActivity(applicationId, type) {
  try {
    await api.post(`/applications/${applicationId}/activity`, { type });
  } catch (e) {
    // Silently ignore logging errors; avoid blocking UI actions
    console.warn('Activity log failed', e?.response?.data || e.message);
  }
}
