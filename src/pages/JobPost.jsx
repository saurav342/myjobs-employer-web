import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const jobRoles = [
  'Risk Compliance', 'Software Development', 'Marketing', 'Sales', 'HR', 'Finance',
  'Operations', 'Customer Service', 'Data Analysis', 'Design', 'Other'
];

const jobTypes = ['Full Time', 'Part Time', 'Both (Full-Time And Part-Time)'];
const workLocationTypes = ['Work From Office', 'Work From Home', 'Field Job'];
const payTypes = ['Fixed Only', 'Fixed + Incentive', 'Incentive Only'];

const educationLevels = [
  '10th Or Below 10th', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate'
];

const englishLevels = [
  'No English', 'Basic English', 'Good English'
];

const experienceOptions = [
  'Any', 'Fresher Only', 'Experienced Only'
];

const minExperienceOptions = [
  '6 Months', '1 Year', '2 Years', '3 Years', '5 Years', '10 Years'
];

const additionalRequirements = [
  'Industry', 'Gender', 'Age', 'Regional Languages', 'Assets', 'Skills'
];

const perks = [
  'Flexible Working Hours', 'Weekly Payout', 'Overtime Pay', 'Joining Bonus',
  'Annual Bonus', 'PF', 'Travel Allowance (TA)', 'Petrol Allowance',
  'Mobile Allowance', 'Internet Allowance', 'Laptop', 'Health Insurance',
  'ESI (ESIC)', 'Food/Meals', 'Accommodation', '5 Working Days',
  'One-Way Cab', 'Two-Way Cab'
];

export default function JobPost() {
  const nav = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    // Job Details
    companyName: 'Infosys',
    jobTitle: '',
    jobRole: '',
    jobType: 'Full Time',
    nightShift: false,
    
    // Location
    workLocationType: 'Work From Home',
    jobCity: 'Bengaluru/Bangalore Region',
    
    // Compensation
    payType: 'Fixed Only',
    fixedSalaryMin: '10000',
    fixedSalaryMax: '100000',
    
    // Perks
    additionalPerks: [],
    
    // Joining fee
    joiningFeeRequired: false,
    
    // Candidate Requirements
    minEducation: '12th Pass',
    englishLevel: 'Basic English',
    experienceRequired: 'Experienced Only',
    minExperience: '1 Year',
    additionalRequirements: [],
    
    // Job Description
    jobDescription: '',
    
    // Interview Information
    isWalkInInterview: true,
    walkInAddress: 'WJ5W+PM8, 22nd A Main Rd, Parangi Palaya, Sector 2, HSR Layout, Bengaluru, Karnataka 560102, India',
    walkInStartDate: '2025-09-25',
    walkInEndDate: '2025-09-25',
    walkInStartTime: '10:00 AM',
    walkInEndTime: '4:00 PM',
    otherInstructions: '',
    
    // Communication Preferences
    contactPreference: 'myself',
    
    // Notification Preferences
    whatsappAlerts: 'myself'
  });

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const togglePerk = (perk) => {
    setForm(prev => ({
      ...prev,
      additionalPerks: prev.additionalPerks.includes(perk)
        ? prev.additionalPerks.filter(p => p !== perk)
        : [...prev.additionalPerks, perk]
    }));
  };

  const toggleAdditionalRequirement = (req) => {
    setForm(prev => ({
      ...prev,
      additionalRequirements: prev.additionalRequirements.includes(req)
        ? prev.additionalRequirements.filter(r => r !== req)
        : [...prev.additionalRequirements, req]
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateSalaryBreakdown = () => {
    const min = parseInt(form.fixedSalaryMin) || 0;
    const max = parseInt(form.fixedSalaryMax) || 0;
    const avgIncentive = 0; // Based on form.payType
    
    return {
      fixedSalary: `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`,
      avgIncentive: `₹${avgIncentive}`,
      earningPotential: `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`
    };
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title: form.jobTitle,
        company: form.companyName,
        category: form.jobRole,
        jobType: form.jobType.toLowerCase().replace(' ', '-'),
        description: form.jobDescription,
        location: { city: 'Bengaluru', state: 'Karnataka' },
        salary: { 
          min: parseInt(form.fixedSalaryMin), 
          max: parseInt(form.fixedSalaryMax), 
          period: 'monthly' 
        },
        requirements: [],
        benefits: form.additionalPerks,
        urgentHiring: false,
        featured: false,
        status: 'active',
        // Additional fields for the new flow
        workLocationType: form.workLocationType,
        payType: form.payType,
        minEducation: form.minEducation,
        englishLevel: form.englishLevel,
        experienceRequired: form.experienceRequired,
        minExperience: form.minExperience,
        isWalkInInterview: form.isWalkInInterview,
        walkInAddress: form.walkInAddress,
        walkInStartDate: form.walkInStartDate,
        walkInEndDate: form.walkInEndDate,
        walkInStartTime: form.walkInStartTime,
        walkInEndTime: form.walkInEndTime,
        otherInstructions: form.otherInstructions,
        contactPreference: form.contactPreference,
        whatsappAlerts: form.whatsappAlerts
      };

      const res = await api.post('/jobs', payload);
      if (res.data?.success) {
        nav('/jobs');
      } else {
        setError(res.data?.message || 'Failed to create job');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
          <div className="step-number">
            {currentStep > step ? '✓' : step}
          </div>
          <div className="step-label">
            {step === 1 && 'Job details'}
            {step === 2 && 'Candidate requirements'}
            {step === 3 && 'Interview information'}
            {step === 4 && 'Job preview'}
            {step === 5 && 'Complete'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderJobDetails = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Post a new job</h2>
        <button className="use-templates-btn">Use Templates</button>
      </div>

      <div className="section">
        <p className="section-description">
          We use this information to find the best candidates for the job. *Marked fields are mandatory.
        </p>

        <div className="form-group">
          <label>Company you're hiring for*</label>
          <div className="company-display">
            <span>{form.companyName}</span>
            <button className="change-btn">Change</button>
          </div>
        </div>

        <div className="form-group">
          <label>Job title / Designation*</label>
          <input
            type="text"
            placeholder="Enter job title"
            value={form.jobTitle}
            onChange={(e) => updateForm('jobTitle', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Job Role/ Category* ℹ️</label>
          <select
            value={form.jobRole}
            onChange={(e) => updateForm('jobRole', e.target.value)}
            className="form-input"
          >
            <option value="">Select category</option>
            {jobRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type of Job*</label>
          <div className="radio-group">
            {jobTypes.map(type => (
              <label key={type} className="radio-label">
                <input
                  type="radio"
                  name="jobType"
                  value={type}
                  checked={form.jobType === type}
                  onChange={(e) => updateForm('jobType', e.target.value)}
                />
                {type}
              </label>
            ))}
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.nightShift}
              onChange={(e) => updateForm('nightShift', e.target.checked)}
            />
            This is a night shift job
          </label>
        </div>

        <div className="section">
          <h3>Location</h3>
          <p className="section-description">
            Let candidates know where they will be working from.
          </p>

          <div className="form-group">
            <label>Work location type*</label>
            <div className="radio-group">
              {workLocationTypes.map(type => (
                <label key={type} className="radio-label">
                  <input
                    type="radio"
                    name="workLocationType"
                    value={type}
                    checked={form.workLocationType === type}
                    onChange={(e) => updateForm('workLocationType', e.target.value)}
                  />
                  {type}
                  {type === 'Field Job' && ' ℹ️'}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Job City*</label>
            <select
              value={form.jobCity}
              onChange={(e) => updateForm('jobCity', e.target.value)}
              className="form-input"
            >
              <option value="Bengaluru/Bangalore Region">Bengaluru/Bangalore Region</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>
            <p className="info-text">
              You will be receiving applications from within Bengaluru/Bangalore Region ℹ️
            </p>
          </div>
        </div>

        <div className="section">
          <h3>Compensation</h3>
          <p className="section-description">
            Job postings with right salary & Incentives will help you find the right candidates.
          </p>

          <div className="form-group">
            <label>What is the pay type?*</label>
            <div className="radio-group">
              {payTypes.map(type => (
                <label key={type} className="radio-label">
                  <input
                    type="radio"
                    name="payType"
                    value={type}
                    checked={form.payType === type}
                    onChange={(e) => updateForm('payType', e.target.value)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Fixed salary / month* ℹ️</label>
            <div className="salary-range">
              <input
                type="number"
                placeholder="10,000"
                value={form.fixedSalaryMin}
                onChange={(e) => updateForm('fixedSalaryMin', e.target.value)}
                className="salary-input"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="1,00,000"
                value={form.fixedSalaryMax}
                onChange={(e) => updateForm('fixedSalaryMax', e.target.value)}
                className="salary-input"
              />
            </div>
          </div>

          <div className="salary-breakdown">
            <h4>Salary breakup shown to candidates</h4>
            <div className="breakdown-item">
              <span>Fixed Salary / Month:</span>
              <span>{calculateSalaryBreakdown().fixedSalary}</span>
            </div>
            <div className="breakdown-item">
              <span>Average Incentive / Month:</span>
              <span>{calculateSalaryBreakdown().avgIncentive}</span>
            </div>
            <div className="breakdown-item">
              <span>Earning Potential / Month:</span>
              <span>{calculateSalaryBreakdown().earningPotential}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Do you offer any additional perks?</h3>
          <div className="perks-grid">
            {perks.map(perk => (
              <button
                key={perk}
                type="button"
                className={`perk-chip ${form.additionalPerks.includes(perk) ? 'selected' : ''}`}
                onClick={() => togglePerk(perk)}
              >
                {form.additionalPerks.includes(perk) ? '✓' : '+'} {perk}
              </button>
            ))}
          </div>
          <button className="add-perk-btn">+ Add other perks</button>
        </div>

        <div className="form-group">
          <label>Is there any joining fee or deposit required from the candidate?*</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="joiningFee"
                value="yes"
                checked={form.joiningFeeRequired}
                onChange={(e) => updateForm('joiningFeeRequired', e.target.value === 'yes')}
              />
              Yes
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="joiningFee"
                value="no"
                checked={!form.joiningFeeRequired}
                onChange={(e) => updateForm('joiningFeeRequired', e.target.value === 'no')}
              />
              No
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCandidateRequirements = () => (
    <div className="step-content">
      <div className="section">
        <h3>Basic Requirements</h3>
        <p className="section-description">
          We'll use these requirement details to make your job visible to the right candidates.
        </p>

        <div className="form-group">
          <label>Minimum Education*</label>
          <div className="option-buttons">
            {educationLevels.map(level => (
              <button
                key={level}
                type="button"
                className={`option-btn ${form.minEducation === level ? 'selected' : ''}`}
                onClick={() => updateForm('minEducation', level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>English level required*</label>
          <div className="option-buttons">
            {englishLevels.map(level => (
              <button
                key={level}
                type="button"
                className={`option-btn ${form.englishLevel === level ? 'selected' : ''}`}
                onClick={() => updateForm('englishLevel', level)}
              >
                {level} {level !== 'No English' && 'ℹ️'}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Total experience required*</label>
          <div className="option-buttons">
            {experienceOptions.map(exp => (
              <button
                key={exp}
                type="button"
                className={`option-btn ${form.experienceRequired === exp ? 'selected' : ''}`}
                onClick={() => updateForm('experienceRequired', exp)}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Minimum experience*</label>
          <div className="option-buttons">
            {minExperienceOptions.map(exp => (
              <button
                key={exp}
                type="button"
                className={`option-btn ${form.minExperience === exp ? 'selected' : ''}`}
                onClick={() => updateForm('minExperience', exp)}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        <h3>Additional Requirements (Optional)</h3>
        <p className="section-description">
          Add additional requirement so that we can help you find the right candidates
        </p>

        <div className="additional-requirements">
          {additionalRequirements.map(req => (
            <button
              key={req}
              type="button"
              className={`req-chip ${form.additionalRequirements.includes(req) ? 'selected' : ''}`}
              onClick={() => toggleAdditionalRequirement(req)}
            >
              {form.additionalRequirements.includes(req) ? '✕' : '+'} {req}
            </button>
          ))}
        </div>

        {form.additionalRequirements.includes('Gender') && (
          <div className="form-group">
            <label>Gender ℹ️</label>
            <div className="option-buttons">
              {['Male', 'Female', 'Both'].map(gender => (
                <button
                  key={gender}
                  type="button"
                  className={`option-btn ${form.selectedGender === gender ? 'selected' : ''}`}
                  onClick={() => updateForm('selectedGender', gender)}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        )}

        <h3>Job Description</h3>
        <p className="section-description">
          Describe the responsibilities of this job and other specific requirements here.
        </p>

        <div className="text-editor">
          <div className="editor-toolbar">
            <button className="toolbar-btn">B</button>
            <button className="toolbar-btn">I</button>
            <button className="toolbar-btn">U</button>
            <button className="toolbar-btn">≡</button>
            <button className="toolbar-btn">≡</button>
            <button className="toolbar-btn">≡</button>
            <button className="toolbar-btn">•</button>
          </div>
          <textarea
            placeholder="Enter job description..."
            value={form.jobDescription}
            onChange={(e) => updateForm('jobDescription', e.target.value)}
            className="editor-textarea"
          />
        </div>
      </div>
    </div>
  );

  const renderInterviewInfo = () => (
    <div className="step-content">
      <div className="section">
        <h3>Interview method and address</h3>
        <p className="section-description">
          Let candidates know how interview will be conducted for this job.
        </p>

        <div className="form-group">
          <label>Is this a walk-in interview? <span className="new-tag">New</span> <a href="#" className="know-more">Know More</a></label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="walkInInterview"
                value="yes"
                checked={form.isWalkInInterview}
                onChange={(e) => updateForm('isWalkInInterview', e.target.value === 'yes')}
              />
              Yes
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="walkInInterview"
                value="no"
                checked={!form.isWalkInInterview}
                onChange={(e) => updateForm('isWalkInInterview', e.target.value === 'no')}
              />
              No
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Walk-in Interview address</label>
          <div className="address-input-container">
            <input
              type="text"
              value={form.walkInAddress}
              onChange={(e) => updateForm('walkInAddress', e.target.value)}
              className="address-input"
            />
            <button className="clear-btn">✕</button>
          </div>
          <a href="#" className="add-floor-link">Add Floor / Plot no. / Shop no. (optional)</a>
        </div>

        <div className="date-time-group">
          <div className="form-group">
            <label>Walk-in Start date</label>
            <input
              type="date"
              value={form.walkInStartDate}
              onChange={(e) => updateForm('walkInStartDate', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Walk-in End Date</label>
            <input
              type="date"
              value={form.walkInEndDate}
              onChange={(e) => updateForm('walkInEndDate', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="time-group">
          <div className="form-group">
            <label>Walk-in timings</label>
            <div className="time-inputs">
              <select
                value={form.walkInStartTime}
                onChange={(e) => updateForm('walkInStartTime', e.target.value)}
                className="time-select"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
              </select>
              <span>to</span>
              <select
                value={form.walkInEndTime}
                onChange={(e) => updateForm('walkInEndTime', e.target.value)}
                className="time-select"
              >
                <option value="4:00 PM">4:00 PM</option>
                <option value="5:00 PM">5:00 PM</option>
                <option value="6:00 PM">6:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Other Instructions</label>
          <div className="textarea-container">
            <textarea
              placeholder="Enter any additional instructions..."
              value={form.otherInstructions}
              onChange={(e) => updateForm('otherInstructions', e.target.value)}
              className="instructions-textarea"
              maxLength={300}
            />
            <div className="char-count">{form.otherInstructions.length}/300</div>
          </div>
        </div>

        <h3>Communication Preferences</h3>
        <div className="form-group">
          <label>Do you want candidates to contact you via Call / Whatsapp after they apply?*</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="contactPreference"
                value="myself"
                checked={form.contactPreference === 'myself'}
                onChange={(e) => updateForm('contactPreference', e.target.value)}
              />
              Yes, to myself
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="contactPreference"
                value="other"
                checked={form.contactPreference === 'other'}
                onChange={(e) => updateForm('contactPreference', e.target.value)}
              />
              Yes, to other recruiter
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="contactPreference"
                value="no"
                checked={form.contactPreference === 'no'}
                onChange={(e) => updateForm('contactPreference', e.target.value)}
              />
              No, I will contact candidates first
            </label>
          </div>
          {form.isWalkInInterview && (
            <p className="disabled-message">This option is not available for walk-in interview</p>
          )}
        </div>

        <h3>Notification Preferences</h3>
        <div className="form-group">
          <label>Every time you receive a candidate application, do you want Whatsapp Alerts from Happy Jobs?* 📱</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="whatsappAlerts"
                value="myself"
                checked={form.whatsappAlerts === 'myself'}
                onChange={(e) => updateForm('whatsappAlerts', e.target.value)}
              />
              Yes, to myself
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="whatsappAlerts"
                value="summary"
                checked={form.whatsappAlerts === 'summary'}
                onChange={(e) => updateForm('whatsappAlerts', e.target.value)}
              />
              No, send me summary once a day
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobPreview = () => (
    <div className="step-content">
      <div className="ai-suggestion-banner">
        <span>Based on your job description, check our AI suggestions to help you attract relevant candidates</span>
        <button className="ai-suggestion-btn">+ Happy Jobs AI Suggestion</button>
      </div>
      
      <div className="job-title-section">
        <div className="job-title-display">
          <span className="job-title">{form.jobTitle} → Professional</span>
          <button className="update-btn">Update</button>
        </div>
        <p className="ai-disclaimer">AI suggestions may not always be accurate. Please review before proceeding.</p>
      </div>

      <div className="preview-section">
        <div className="section-header">
          <div className="section-title">
            <span className="section-icon">💼</span>
            <span>Job Details</span>
          </div>
          <div className="section-actions">
            <button className="edit-btn">✏️</button>
            <button className="expand-btn">▼</button>
          </div>
        </div>
        
        <div className="preview-content">
          <div className="detail-row">
            <span className="detail-label">Company name:</span>
            <span className="detail-value">{form.companyName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Job title:</span>
            <span className="detail-value">{form.jobTitle}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Job role/category:</span>
            <span className="detail-value">{form.jobRole}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Job type:</span>
            <span className="detail-value">{form.jobType} | Day shift</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Work type:</span>
            <span className="detail-value">{form.workLocationType}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Job City:</span>
            <span className="detail-value">
              All Areas in {form.jobCity}
              <span className="info-text">You will be receiving applications from {form.jobCity} ℹ️</span>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Monthly Salary | Pay Type:</span>
            <span className="detail-value">{calculateSalaryBreakdown().fixedSalary} per month ({form.payType})</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Additional perks:</span>
            <span className="detail-value">{form.additionalPerks.length > 0 ? form.additionalPerks.join(', ') : 'None'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Joining Fee:</span>
            <span className="detail-value">{form.joiningFeeRequired ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      <div className="preview-section">
        <div className="section-header">
          <div className="section-title">
            <span className="section-icon">👤</span>
            <span>Candidate Requirements</span>
          </div>
          <div className="section-actions">
            <button className="edit-btn">✏️</button>
            <button className="expand-btn">▼</button>
          </div>
        </div>
        
        <div className="preview-content">
          <div className="requirement-section">
            <h4>👤 Eligible requirements</h4>
            <p>Your job will only be visible to the candidates who meet these requirements.</p>
            <div className="requirement-list">
              <div className="requirement-item">
                <span className="requirement-label">Minimum Education:</span>
                <span className="requirement-value">{form.minEducation}</span>
              </div>
              <div className="requirement-item">
                <span className="requirement-label">Experience Required:</span>
                <span className="requirement-value">{form.experienceRequired}</span>
              </div>
              <div className="requirement-item">
                <span className="requirement-label">Minimum Experience:</span>
                <span className="requirement-value">{form.minExperience}</span>
              </div>
              <div className="requirement-item">
                <span className="requirement-label">English:</span>
                <span className="requirement-value">{form.englishLevel}</span>
              </div>
            </div>
          </div>

          <div className="requirement-section">
            <h4>💼 Preferred requirements</h4>
            <p>Your job will be promoted to the candidates meeting below requirements, but others can still apply.</p>
            <div className="requirement-list">
              <div className="requirement-item">
                <span className="requirement-label">Age:</span>
                <span className="requirement-value">18 - 60 yrs</span>
              </div>
              <div className="requirement-item">
                <span className="requirement-label">Gender:</span>
                <span className="requirement-value">Both genders allowed</span>
              </div>
              <div className="requirement-item">
                <span className="requirement-label">Industry:</span>
                <span className="requirement-value">None</span>
              </div>
            </div>
          </div>

          <div className="job-description-preview">
            <h4>Job Description</h4>
            <p>{form.jobDescription || 'No description provided'}</p>
          </div>
        </div>
      </div>

      <div className="preview-section">
        <div className="section-header">
          <div className="section-title">
            <span className="section-icon">👥</span>
            <span>Interview Information</span>
          </div>
          <div className="section-actions">
            <button className="edit-btn">✏️</button>
            <button className="expand-btn">▼</button>
          </div>
        </div>
        
        <div className="preview-content">
          <div className="detail-row">
            <span className="detail-label">Communication Preference:</span>
            <span className="detail-value">{form.contactPreference === 'myself' ? 'Myself' : 'Other'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Is this walk-in interview?</span>
            <span className="detail-value">{form.isWalkInInterview ? 'Yes' : 'No'}</span>
          </div>
          <a href="#" className="view-more-link">View 2 more</a>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderJobDetails();
      case 2:
        return renderCandidateRequirements();
      case 3:
        return renderInterviewInfo();
      case 4:
        return renderJobPreview();
      default:
        return renderJobDetails();
    }
  };

  return (
    <div className="job-post-container">
      <div className="job-post-header">
        <button className="back-btn" onClick={() => nav('/jobs')}>← Post job</button>
      </div>

      {renderStepIndicator()}

      <div className="job-post-content">
        {renderCurrentStep()}
      </div>

      <div className="job-post-footer">
        <div className="footer-actions">
          {currentStep > 1 && (
            <button className="back-btn-footer" onClick={prevStep}>
              Back
            </button>
          )}
          {currentStep < 4 ? (
            <button className="continue-btn" onClick={nextStep}>
              Continue
            </button>
          ) : (
            <button 
              className="continue-btn" 
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
