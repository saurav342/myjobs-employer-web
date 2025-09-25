import React, { useEffect, useMemo, useState } from 'react';
import { searchCandidates, getCredits, addCredits, revealContact, getSavedSearches, saveSearch, deleteSavedSearch, updateTags, addNote, sendMessages, createInterview, listInterviews } from '../services/employers.js';

const categories = [
  'construction','manufacturing','delivery','housekeeping','security','driver','cook','waiter','welder','carpenter','painter','mason','loader','gardener','electrician','plumber','mechanic','cleaner','helper','retail','cleaning','cooking','other'
];

export default function CandidateSearch() {
  const [filters, setFilters] = useState({ city: '', category: '', search: '', minSalary: '', maxSalary: '', willingToTravel: false });
  const [data, setData] = useState({ candidates: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState([]);
  const [templateId, setTemplateId] = useState('545fb765-c204-44ba-8ac0-62ec1a1c71f0');

  const fetch = async () => {
    setLoading(true); setError('');
    try {
      const res = await searchCandidates({ ...filters, willingToTravel: filters.willingToTravel ? 'true' : '' });
      setData(res);
    } catch (e) { setError('Failed to fetch candidates'); }
    finally { setLoading(false); }
  };

  useEffect(() => { (async ()=>{ try { setCredits(await getCredits()); setSaved(await getSavedSearches()); } catch {} })(); }, []);
  useEffect(() => { fetch(); }, []);

  const onReveal = async (candidateId, idx) => {
    try {
      const res = await revealContact(candidateId);
      setCredits(res.credits ?? credits);
      setData((d)=> ({ ...d, candidates: d.candidates.map((c,i)=> i===idx ? { ...c, contact: res.data } : c) }));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to reveal contact');
    }
  };

  const onSaveSearch = async () => {
    const name = prompt('Name this search');
    if (!name) return;
    try { await saveSearch(name, filters); setSaved(await getSavedSearches()); } catch { alert('Failed to save search'); }
  };

  const applySaved = async (s) => {
    setFilters(s.filters); setTimeout(fetch, 0);
  };

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Candidate Search</h2>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <span className="chip">Credits: {credits}</span>
          <button className="btn" onClick={async ()=> setCredits(await addCredits(10))}>Add 10 credits</button>
          <button className="btn ghost" onClick={onSaveSearch}>Save Search</button>
        </div>
      </div>

      <div className="card mt-16">
        <div className="row wrap" style={{ gap: 12 }}>
          <input placeholder="City" value={filters.city} onChange={(e)=> setFilters((f)=> ({ ...f, city: e.target.value }))} />
          <select value={filters.category} onChange={(e)=> setFilters((f)=> ({ ...f, category: e.target.value }))}>
            <option value="">All categories</option>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <input placeholder="Search name/skill" value={filters.search} onChange={(e)=> setFilters((f)=> ({ ...f, search: e.target.value }))} />
          <input type="number" placeholder="Min salary" value={filters.minSalary} onChange={(e)=> setFilters((f)=> ({ ...f, minSalary: e.target.value }))} />
          <input type="number" placeholder="Max salary" value={filters.maxSalary} onChange={(e)=> setFilters((f)=> ({ ...f, maxSalary: e.target.value }))} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={filters.willingToTravel} onChange={(e)=> setFilters((f)=> ({ ...f, willingToTravel: e.target.checked }))} /> Willing to travel
          </label>
          <button className="btn" onClick={fetch}>Search</button>
        </div>
      </div>

      <div className="row" style={{ gap: 16, marginTop: 16 }}>
        <div style={{ flex: 1 }}>
          {loading && <div className="card">Loading…</div>}
          {error && <div className="card error">{error}</div>}
          {!loading && data.candidates.length === 0 && <div className="card">No candidates found.</div>}
          {data.candidates.map((c, idx) => (
            <div key={c._id} className="card">
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{c.fullName}</div>
                  <div className="muted">{c.location?.city || '—'} {c.location?.state ? `, ${c.location.state}` : ''}</div>
                  <div className="muted">Categories: {(c.jobPreferences?.categories || []).join(', ') || '—'}</div>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="checkbox" checked={selected.includes(c._id)} onChange={(e)=> setSelected((arr)=> e.target.checked ? [...arr, c._id] : arr.filter(id=> id!==c._id))} /> Select
                  </label>
                  {c.contact ? (
                    <span className="chip">{c.contact.phoneNumber} • {c.contact.email}</span>
                  ) : (
                    <button className="btn" onClick={()=> onReveal(c._id, idx)}>View Contact (1 credit)</button>
                  )}
                </div>
              </div>
              <div className="mt-8">
                <strong>Skills:</strong> {(c.skills || []).slice(0,8).join(', ') || '—'}
              </div>
              <div className="mt-8 row wrap" style={{ gap: 8, alignItems: 'center' }}>
                <TagEditor initialTags={c.employerMeta?.tags || []} onChange={async (tags)=> { await updateTags(c._id, tags); setData((d)=> ({ ...d, candidates: d.candidates.map((x,i)=> i===idx? { ...x, employerMeta: { ...(x.employerMeta||{}), tags } } : x) })); }} />
                <NoteAdder onAdd={async (text)=> { await addNote(c._id, text); alert('Note added'); }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ width: 320 }}>
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Saved Searches</div>
            {saved.length === 0 && <div className="muted">No saved searches</div>}
            {saved.map((s)=> (
              <div key={s._id} className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <button className="btn ghost" onClick={()=> applySaved(s)}>{s.name}</button>
                <button className="btn ghost" onClick={async ()=> { await deleteSavedSearch(s._id); setSaved(await getSavedSearches()); }}>✕</button>
              </div>
            ))}
          </div>
          <div className="card mt-16">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Bulk Message</div>
            <div className="muted" style={{ marginBottom: 8 }}>Selected: {selected.length}</div>
            <label>Template ID</label>
            <input value={templateId} onChange={(e)=> setTemplateId(e.target.value)} />
            <button className="btn" style={{ marginTop: 8 }} onClick={async ()=>{
              if (selected.length === 0) return;
              try {
                const result = await sendMessages(selected, templateId, {});
                alert(`Sent: ${result.sent}, Failed: ${result.failed}`);
              } catch { alert('Failed to send'); }
            }}>Send WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TagEditor({ initialTags, onChange }) {
  const [tags, setTags] = useState(initialTags);
  const [val, setVal] = useState('');
  useEffect(()=> setTags(initialTags), [initialTags]);
  return (
    <div className="row wrap" style={{ gap: 6 }}>
      {tags.map((t,i)=> (
        <span key={i} className="chip" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {t}
          <button className="btn ghost" onClick={()=> { const next = tags.filter((_,x)=> x!==i); setTags(next); onChange(next); }}>✕</button>
        </span>
      ))}
      <input value={val} onChange={(e)=> setVal(e.target.value)} placeholder="Add tag" />
      <button className="btn" onClick={()=> { if (val.trim()) { const next=[...tags, val.trim()]; setTags(next); setVal(''); onChange(next); } }}>Add</button>
    </div>
  );
}

function NoteAdder({ onAdd }) {
  const [text, setText] = useState('');
  return (
    <div className="row" style={{ gap: 6 }}>
      <input value={text} onChange={(e)=> setText(e.target.value)} placeholder="Add note" />
      <button className="btn" onClick={()=> { if (text.trim()) { onAdd(text.trim()); setText(''); } }}>Save</button>
    </div>
  );
}
