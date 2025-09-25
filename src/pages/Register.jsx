import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerEmployer, sendOTP, verifyOTP } from '../services/auth.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Register() {
  const nav = useNavigate();
  const loc = useLocation();
  const { loginWithToken } = useAuth();
  const phoneFromLogin = loc.state?.phoneNumber || '';

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    companyName: '',
    city: '',
    state: '',
    phoneNumber: phoneFromLogin
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.fullName.trim().length >= 2 &&
      /.+@.+\..+/.test(form.email) &&
      form.companyName.trim().length >= 2 &&
      form.city.trim().length >= 2 &&
      form.state.trim().length >= 2 &&
      /^\d{10}$/.test(form.phoneNumber)
    );
  }, [form]);

  const onSubmit = async () => {
    setError('');
    if (!canSubmit) { setError('Please fill all required fields correctly'); return; }
    setLoading(true);
    try {
      // If the phone wasn't verified already, ensure OTP flow has happened
      // We assume coming from /login means OTP was verified; otherwise we register anyway
      const res = await registerEmployer({
        fullName: form.fullName,
        email: form.email,
        companyName: form.companyName,
        city: form.city,
        state: form.state,
        phoneNumber: form.phoneNumber
      });
      if (res.success && res.token && res.user) {
        loginWithToken(res.token, res.user);
        nav('/');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: 720 }}>
        <h2>Create Employer Account</h2>
        <p className="muted">OTP-only login. We’ll use this profile for your jobs.</p>
        <div className="mt-16 stack">
          <div className="row wrap">
            <div className="col">
              <label>Full Name</label>
              <input value={form.fullName} onChange={update('fullName')} placeholder="Your name" />
            </div>
            <div className="col">
              <label>Company Name</label>
              <input value={form.companyName} onChange={update('companyName')} placeholder="Company Pvt Ltd" />
            </div>
          </div>
          <div className="row wrap">
            <div className="col">
              <label>Email</label>
              <input type="email" value={form.email} onChange={update('email')} placeholder="you@company.com" />
            </div>
            <div className="col">
              <label>Mobile Number</label>
              <input value={form.phoneNumber} onChange={update('phoneNumber')} placeholder="10-digit mobile" maxLength={10} />
            </div>
          </div>
          <div className="row wrap">
            <div className="col">
              <label>City</label>
              <input value={form.city} onChange={update('city')} placeholder="City" />
            </div>
            <div className="col">
              <label>State</label>
              <input value={form.state} onChange={update('state')} placeholder="State" />
            </div>
          </div>

          <button className="btn primary" onClick={onSubmit} disabled={!canSubmit || loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
