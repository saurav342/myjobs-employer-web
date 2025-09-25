import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { getTemplates } from '../services/jobs.js';

const categories = [
  'construction','manufacturing','delivery','housekeeping','security','driver','cook','waiter','welder','carpenter','painter','mason','loader','gardener','electrician','plumber','mechanic','cleaner','helper','retail','cleaning','cooking','other'
];
const jobTypes = ['full-time','part-time','contract','temporary'];

export default function JobsNew() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '',
    company: '',
    category: '',
    jobType: '',
    description: '',
    locations: [{ city: '', state: '' }],
    salaryMin: '',
    salaryMax: '',
    requirements: [],
    benefits: [],
    screening: [],
    urgentHiring: false,
    featured: false,
    status: 'active'
  });
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const valid = useMemo(() => {
    const min = parseInt(form.salaryMin || '0', 10);
    const max = parseInt(form.salaryMax || '0', 10);
    return (
      form.title.trim().length >= 3 &&
      form.company.trim().length >= 2 &&
      form.category &&
      form.jobType &&
      form.description.trim().length >= 20 &&
      form.locations.every(l => (l.city||'').trim().length >= 2 && (l.state||'').trim().length >= 2) &&
      min >= 0 && max >= 0 && min <= max
    );
  }, [form]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const updateLoc = (idx, key) => (e) => setForm((f) => {
    const locations = [...f.locations];
    locations[idx] = { ...locations[idx], [key]: e.target.value };
    return { ...f, locations };
  });
  const addLocation = () => setForm((f)=> ({ ...f, locations: [...f.locations, { city: '', state: '' }] }));
  const removeLocation = (idx) => setForm((f)=> ({ ...f, locations: f.locations.filter((_,i)=> i!==idx) }));
  const addRequirement = (text) => setForm((f)=> ({ ...f, requirements: [...f.requirements, text] }));
  const removeRequirement = (i) => setForm((f)=> ({ ...f, requirements: f.requirements.filter((_,x)=> x!==i) }));
  const addBenefit = (text) => setForm((f)=> ({ ...f, benefits: [...f.benefits, text] }));
  const removeBenefit = (i) => setForm((f)=> ({ ...f, benefits: f.benefits.filter((_,x)=> x!==i) }));
  const addQuestion = () => setForm((f)=> ({ ...f, screening: [...f.screening, { text: '', type: 'yes-no', required: false }] }));
  const updateQuestion = (i, key) => (e) => setForm((f)=> ({ ...f, screening: f.screening.map((q,idx)=> idx===i? { ...q, [key]: key==='required'? e.target.checked : e.target.value }: q) }));
  const removeQuestion = (i) => setForm((f)=> ({ ...f, screening: f.screening.filter((_,x)=> x!==i) }));

  useEffect(() => {
    (async () => {
      try { setTemplates(await getTemplates()); } catch {}
    })();
  }, []);

  const postOne = async (loc, statusOverride) => {
    const payload = {
      title: form.title,
      company: form.company,
      category: form.category,
      jobType: form.jobType,
      description: form.description,
      location: { city: loc.city, state: loc.state },
      salary: { min: parseInt(form.salaryMin, 10), max: parseInt(form.salaryMax, 10), period: 'monthly' },
      requirements: form.requirements,
      benefits: form.benefits,
      screeningQuestions: form.screening,
      urgentHiring: !!form.urgentHiring,
      featured: !!form.featured,
      status: statusOverride || form.status,
    };
    return api.post('/jobs', payload);
  };

  const onSubmit = async () => {
    setError('');
    if (!valid) { setError('Please complete required fields'); return; }
    setLoading(true);
    try {
      // Post a job per location
      for (const loc of form.locations) {
        const res = await postOne(loc);
        if (!res.data?.success) throw new Error(res.data?.message || 'Failed to create job');
      }
      nav('/jobs');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create job');
    } finally { setLoading(false); }
  };

  const onSaveDraft = async () => {
    setError('');
    setLoading(true);
    try {
      for (const loc of form.locations) {
        const res = await postOne(loc, 'draft');
        if (!res.data?.success) throw new Error(res.data?.message || 'Failed to save draft');
      }
      nav('/jobs');
    } catch (e) { setError(e.response?.data?.message || e.message || 'Failed to save draft'); }
    finally { setLoading(false); }
  };

  return (
    <div className="container">
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Post a Job</h2>
      </div>
      <div className="card mt-16">
        <div className="stack">
          <div className="row wrap">
            <div className="col">
              <label>Use Template</label>
              <select onChange={(e)=>{
                const t = templates.find(x=> x._id === e.target.value);
                if (!t) return;
                setForm((f)=> ({
                  ...f,
                  title: t.title || '', company: t.company || '', category: t.category || '', jobType: t.jobType || '', description: t.description || '',
                  locations: [{ city: t.location?.city || '', state: t.location?.state || '' }],
                  salaryMin: t.salary?.min ?? '', salaryMax: t.salary?.max ?? '',
                  requirements: t.requirements || [], benefits: t.benefits || [], screening: t.screeningQuestions || [], urgentHiring: !!t.urgentHiring, featured: !!t.featured,
                }));
              }}>
                <option value="">Select template</option>
                {templates.map(t => <option key={t._id} value={t._id}>{t.title} • {t.category}</option>)}
              </select>
            </div>
          </div>
          <div className="row wrap">
            <div className="col">
              <label>Job Title</label>
              <input value={form.title} onChange={update('title')} placeholder="e.g., Driver" />
            </div>
            <div className="col">
              <label>Company</label>
              <input value={form.company} onChange={update('company')} placeholder="Company Pvt Ltd" />
            </div>
          </div>
          <div className="row wrap">
            <div className="col">
              <label>Category</label>
              <select value={form.category} onChange={update('category')}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col">
              <label>Job Type</label>
              <select value={form.jobType} onChange={update('jobType')}>
                <option value="">Select type</option>
                {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label>Description</label>
            <textarea value={form.description} onChange={update('description')} placeholder="Describe responsibilities, requirements, benefits…" />
          </div>
          <div>
            <label>Locations</label>
            {form.locations.map((loc, idx)=> (
              <div key={idx} className="row wrap" style={{ gap: 8, alignItems: 'center' }}>
                <input value={loc.city} onChange={updateLoc(idx,'city')} placeholder="City" />
                <input value={loc.state} onChange={updateLoc(idx,'state')} placeholder="State" />
                {form.locations.length > 1 && <button className="btn ghost" onClick={()=> removeLocation(idx)}>Remove</button>}
              </div>
            ))}
            <button className="btn" onClick={addLocation} style={{ marginTop: 8 }}>Add Location</button>
          </div>
          <div className="row wrap">
            <div className="col">
              <label>Salary Min (monthly)</label>
              <input type="number" value={form.salaryMin} onChange={update('salaryMin')} placeholder="e.g., 10000" />
            </div>
            <div className="col">
              <label>Salary Max (monthly)</label>
              <input type="number" value={form.salaryMax} onChange={update('salaryMax')} placeholder="e.g., 20000" />
            </div>
          </div>
          <div className="row wrap">
            <div className="col">
              <label>Requirements</label>
              <ChipEditor items={form.requirements} onAdd={addRequirement} onRemove={removeRequirement} placeholder="e.g., 2+ years driving" />
            </div>
            <div className="col">
              <label>Benefits</label>
              <ChipEditor items={form.benefits} onAdd={addBenefit} onRemove={removeBenefit} placeholder="e.g., Fuel allowance" />
            </div>
          </div>
          <div>
            <label>Screening Questions</label>
            {form.screening.map((q, i)=> (
              <div key={i} className="row wrap" style={{ gap: 8, alignItems: 'center' }}>
                <input value={q.text} onChange={updateQuestion(i,'text')} placeholder="Question text" />
                <select value={q.type} onChange={updateQuestion(i,'type')}>
                  <option value="yes-no">Yes/No</option>
                  <option value="number">Number</option>
                  <option value="text">Text</option>
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={q.required} onChange={updateQuestion(i,'required')} /> Required
                </label>
                <button className="btn ghost" onClick={()=> removeQuestion(i)}>Remove</button>
              </div>
            ))}
            <button className="btn" onClick={addQuestion} style={{ marginTop: 8 }}>Add Question</button>
          </div>
          <div className="row wrap">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.urgentHiring} onChange={(e)=> setForm((f)=> ({ ...f, urgentHiring: e.target.checked }))} /> Urgent hiring
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.featured} onChange={(e)=> setForm((f)=> ({ ...f, featured: e.target.checked }))} /> Featured
            </label>
          </div>
          <div className="row wrap">
            <div className="col">
              <button className="btn primary" onClick={onSubmit} disabled={!valid || loading}>
                {loading ? 'Posting…' : 'Post Job'}
              </button>
              {error && <div className="error mt-16">{error}</div>}
            </div>
            <div className="col">
              <div className="card" style={{ background: '#f8fafc' }}>
                <div className="muted" style={{ fontWeight: 700, marginBottom: 8 }}>Preview</div>
                <div style={{ fontWeight: 800 }}>{form.title || 'Job title'}</div>
                <div className="muted">{(form.company || 'Company')} • {(form.category || 'Category')} • {(form.locations[0]?.city || 'City')}, {(form.locations[0]?.state || 'State')}</div>
                <div className="chip" style={{ marginTop: 8 }}>{form.jobType || 'Type'}</div>
                <p className="muted" style={{ marginTop: 12 }}>{form.description || 'Description will appear here.'}</p>
              </div>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={onSaveDraft} disabled={loading}>Save Draft</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipEditor({ items, onAdd, onRemove, placeholder }) {
  const [val, setVal] = useState('');
  return (
    <div>
      <div className="row wrap" style={{ gap: 6 }}>
        {items.map((it, i)=> (
          <span key={i} className="chip" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {it}
            <button className="btn ghost" onClick={()=> onRemove(i)}>✕</button>
          </span>
        ))}
      </div>
      <div className="row" style={{ gap: 6, marginTop: 6 }}>
        <input value={val} onChange={(e)=> setVal(e.target.value)} placeholder={placeholder} />
        <button className="btn" onClick={()=> { if (val.trim()) { onAdd(val.trim()); setVal(''); } }}>Add</button>
      </div>
    </div>
  );
}
