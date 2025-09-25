import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function Profile() {
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    companyDescription: '',
    website: '',
    contactInfo: { person: '', phone: '', email: '' },
    location: { city: '', state: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/users/profile');
        if (!mounted) return;
        const u = res.data?.data || {};
        setForm({
          companyName: u.companyName || '',
          industry: u.industry || '',
          companySize: u.companySize || '',
          companyDescription: u.companyDescription || '',
          website: u.website || '',
          contactInfo: u.contactInfo || { person: '', phone: '', email: '' },
          location: u.location || { city: '', state: '' },
        });
      } catch (e) { setError('Failed to load profile'); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  const update = (k, nested) => (e) => {
    const v = e.target.value;
    setForm((f) => nested ? { ...f, [nested]: { ...f[nested], [k]: v } } : { ...f, [k]: v });
  };

  const onSave = async () => {
    setSaving(true); setError(''); setMessage('');
    try {
      const payload = {
        companyName: form.companyName,
        industry: form.industry,
        companySize: form.companySize,
        companyDescription: form.companyDescription,
        website: form.website,
        contactInfo: form.contactInfo,
        location: form.location,
      };
      const res = await api.put('/users/profile', payload);
      setMessage(res.data?.message || 'Profile updated');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save profile');
    } finally { setSaving(false); }
  };

  return (
    <div className="container">
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Company Profile</h2>
      </div>
      <div className="card mt-16">
        {loading ? 'Loading…' : (
          <div className="stack">
            <div className="row wrap">
              <div className="col">
                <label>Company Name</label>
                <input value={form.companyName} onChange={update('companyName')} placeholder="Company Pvt Ltd" />
              </div>
              <div className="col">
                <label>Industry</label>
                <input value={form.industry} onChange={update('industry')} placeholder="e.g., Logistics" />
              </div>
            </div>
            <div className="row wrap">
              <div className="col">
                <label>Company Size</label>
                <select value={form.companySize} onChange={update('companySize')}>
                  <option value="">Select</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
              </div>
              <div className="col">
                <label>Website</label>
                <input value={form.website} onChange={update('website')} placeholder="https://" />
              </div>
            </div>
            <div className="row wrap">
              <div className="col">
                <label>City</label>
                <input value={form.location.city} onChange={update('city','location')} placeholder="City" />
              </div>
              <div className="col">
                <label>State</label>
                <input value={form.location.state} onChange={update('state','location')} placeholder="State" />
              </div>
            </div>
            <div className="row wrap">
              <div className="col">
                <label>Contact Person</label>
                <input value={form.contactInfo.person} onChange={update('person','contactInfo')} placeholder="Name" />
              </div>
              <div className="col">
                <label>Contact Phone</label>
                <input value={form.contactInfo.phone} onChange={update('phone','contactInfo')} placeholder="Phone" />
              </div>
              <div className="col">
                <label>Contact Email</label>
                <input value={form.contactInfo.email} onChange={update('email','contactInfo')} placeholder="Email" />
              </div>
            </div>
            <div>
              <label>About Company</label>
              <textarea value={form.companyDescription} onChange={update('companyDescription')} placeholder="What does your company do?" />
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn primary" onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</button>
              {message && <div className="chip" style={{ background: '#e8fff3', color: '#065f46' }}>{message}</div>}
              {error && <div className="error">{error}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

