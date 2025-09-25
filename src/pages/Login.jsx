import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP } from '../services/auth.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { loginWithToken, user } = useAuth();

  useEffect(() => { if (user) nav('/'); }, [user]);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(0); // Start with mobile number entry (step 0)
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const onSend = async () => {
    setError('');
    const clean = phone.replace(/\D/g, '');
    if (!/^\d{10}$/.test(clean)) { setError('Enter 10-digit phone'); return; }
    setSending(true);
    try {
      const res = await sendOTP(clean);
      if (res.success) { 
        setStep(1); // Move to OTP verification step
        setResendTimer(30);
        setTimeout(() => otpRefs.current[0]?.focus(), 100); 
      }
      else setError(res.message || 'Failed to send OTP');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send OTP');
    } finally { setSending(false); }
  };

  const onVerify = async () => {
    setError('');
    const clean = phone.replace(/\D/g, '');
    if (!/^\d{4}$/.test(otp)) { setError('Enter 4-digit OTP'); return; }
    setVerifying(true);
    try {
      const res = await verifyOTP(clean, otp);
      if (res.success && res.isRegistered && res.token && res.user) {
        if (res.user.userType !== 'employer') {
          setError('Account exists but not an employer. Use employer number.');
          setVerifying(false);
          return;
        }
        loginWithToken(res.token, res.user);
        nav(state?.from?.pathname || '/');
      } else if (res.success && res.isRegistered === false) {
        // Take them to company setup; pass phone
        nav('/onboarding', { state: { phoneNumber: clean } });
      } else {
        setError(res.message || 'OTP verification failed');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'OTP verification failed');
    } finally { setVerifying(false); }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = otp.split('');
    newOtp[index] = value;
    const otpString = newOtp.join('');
    setOtp(otpString);
    
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    await onSend();
  };

  return (
    <div className="login-container">
      {/* Left side - Marketing content */}
      <div className="login-marketing">
        <div className="marketing-content">
          <div className="brand-logo">
            <span className="logo-text">Happy Jobs</span>
          </div>
          <h1>Hire top talent in 48 hours with Happy Jobs.</h1>
          <p>Streamline your recruitment with AI-driven precision. Single solution from Fresher to experienced hiring.</p>
          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">6 crore+</div>
              <div className="stat-label">Qualified candidates</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">7 lakhs+</div>
              <div className="stat-label">Employers use Happy Jobs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">900+</div>
              <div className="stat-label">Available cities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="login-form-container">
        <div className="login-card">
          {step === 0 ? (
            <>
              <div className="login-header">
                {/* <button className="back-btn" onClick={() => nav(-1)}>← Back</button> */}
                <h2>Enter Mobile Number</h2>
                <p>We'll send you a verification code</p>
              </div>
              
              <div className="phone-input-container">
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  className="phone-input"
                />
              </div>

              <button 
                className="login-btn" 
                onClick={onSend} 
                disabled={sending || phone.length !== 10}
              >
                {sending ? 'Sending OTP…' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <div className="login-header">
                <button className="back-btn" onClick={() => setStep(0)}>← Back</button>
                <h2>Verify OTP</h2>
                <p>A one time password sent on your mobile number</p>
                <div className="phone-display">+91-{phone}</div>
              </div>
              
              <div className="otp-container">
                <div className="otp-inputs">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="otp-input"
                    />
                  ))}
                </div>
                
                <div className="resend-section">
                  {resendTimer > 0 ? (
                    <span className="resend-timer">
                      Didn't receive OTP? Resend in {String(Math.floor(resendTimer / 60)).padStart(2, '0')}:{String(resendTimer % 60).padStart(2, '0')} Sec
                    </span>
                  ) : (
                    <button className="resend-btn" onClick={onResend}>
                      Didn't receive OTP? Resend
                    </button>
                  )}
                </div>
              </div>

              <button 
                className="login-btn" 
                onClick={onVerify} 
                disabled={verifying || otp.length !== 4}
              >
                {verifying ? 'Verifying…' : 'Login'}
              </button>
            </>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}
