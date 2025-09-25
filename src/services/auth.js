import api from './api.js';

export async function sendOTP(phoneNumber) {
  const res = await api.post('/auth/send-otp', { phoneNumber });
  return res.data;
}

export async function verifyOTP(phoneNumber, otp) {
  const res = await api.post('/auth/verify-otp', { phoneNumber, otp });
  return res.data;
}

export async function registerEmployer({ fullName, email, phoneNumber, companyName, city, state, employeeCount, isConsultancy }) {
  // Backend requires password; generate one silently since login is OTP-only
  const generatedPassword = cryptoRandom(16);
  const res = await api.post('/auth/register', {
    fullName,
    email,
    phoneNumber,
    password: generatedPassword,
    userType: 'employer',
  });
  // If registration succeeded, set company and location on profile
  if (res.data?.success && res.data?.token && res.data?.user) {
    localStorage.setItem('authToken', res.data.token);
    try {
      // Use the new onboarding endpoint for better organization
      await api.put('/auth/employer/onboarding', {
        companyName,
        location: { city, state },
        employeeCount,
        isConsultancy
      });
    } catch (e) {
      // Non-fatal; profile can be completed later
      console.warn('Profile enrichment failed', e?.response?.data || e.message);
    }
  }
  return res.data;
}

function cryptoRandom(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  let acc = '';
  const arr = new Uint32Array(length);
  (window.crypto || window.msCrypto).getRandomValues(arr);
  for (let i = 0; i < length; i++) acc += charset[arr[i] % charset.length];
  return acc;
}
