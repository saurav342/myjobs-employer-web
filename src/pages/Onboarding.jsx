import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerEmployer } from '../services/auth.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const employeeCountOptions = [
  '0-50',
  '51-100', 
  '101-300',
  '301-500',
  '501-1000',
  '1000 above'
];

export default function Onboarding() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { loginWithToken } = useAuth();
  const phoneFromLogin = state?.phoneNumber || '';

  const [form, setForm] = useState({
    fullName: '',
    companyName: '',
    isConsultancy: false,
    employeeCount: '',
    workEmail: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = form.fullName.trim().length >= 2 && 
                   form.companyName.trim().length >= 2 && 
                   form.employeeCount;

  const onSubmit = async () => {
    setError('');
    if (!canSubmit) { 
      setError('Please fill all required fields correctly'); 
      return; 
    }
    
    setLoading(true);
    try {
      const res = await registerEmployer({
        fullName: form.fullName,
        email: form.workEmail || `${form.fullName.toLowerCase().replace(/\s+/g, '.')}@${form.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        companyName: form.companyName,
        city: 'Bengaluru', // Default city
        state: 'Karnataka', // Default state
        phoneNumber: phoneFromLogin,
        employeeCount: form.employeeCount,
        isConsultancy: form.isConsultancy
      });
      
      if (res.success && res.token && res.user) {
        loginWithToken(res.token, res.user);
        nav('/jobs/post');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    } finally { 
      setLoading(false); 
    }
  };

  const update = (key) => (e) => {
    if (key === 'isConsultancy') {
      setForm(f => ({ ...f, [key]: e.target.checked }));
    } else {
      setForm(f => ({ ...f, [key]: e.target.value }));
    }
  };

  return (
    <div className="onboarding-container">
      {/* Left side - Marketing content */}
      <div className="onboarding-marketing">
        <div className="marketing-content">
          <div className="brand-logo">
            <span className="logo-text">Happy JobsHire</span>
          </div>
          <h1>What does Happy Jobs offer</h1>
          <div className="feature-block">
            <div className="feature-icon">✈️</div>
            <div className="feature-content">
              <h3>Job Posting</h3>
              <p>A comprehensive platform for your hiring needs</p>
              <ul className="feature-list">
                <li>✓ AI-powered classic and premium job postings to get candidates at desired speed</li>
                <li>✓ Unlimited applications with 15 days job visibility on the platform</li>
              </ul>
            </div>
          </div>
          <div className="pagination-dots">
            <div className="dot active"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>

      {/* Right side - Onboarding form */}
      <div className="onboarding-form-container">
        <div className="onboarding-card">
          <h2>Let's get you started!</h2>
          
          <div className="form-group">
            <label>Your full name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={update('fullName')}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Enter the name of your company</label>
            <input
              type="text"
              placeholder="e.g Swiggy"
              value={form.companyName}
              onChange={update('companyName')}
              className="form-input"
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.isConsultancy}
                onChange={update('isConsultancy')}
                className="checkbox-input"
              />
              This is a consultancy (Hiring or staffing agency)
            </label>
          </div>

          <div className="form-group">
            <label>Number of employees in your company</label>
            <div className="employee-count-options">
              {employeeCountOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`employee-count-btn ${form.employeeCount === option ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, employeeCount: option }))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Work email (Optional)</label>
            <input
              type="email"
              placeholder="Enter your work email address"
              value={form.workEmail}
              onChange={update('workEmail')}
              className="form-input"
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                required
              />
              I agree to Happy Jobs's <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>.
            </label>
          </div>

          <button 
            className="post-job-btn" 
            onClick={onSubmit} 
            disabled={!canSubmit || loading}
          >
            {loading ? 'Setting up...' : 'Post a job'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}
