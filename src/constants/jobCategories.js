// Comprehensive job categories organized by industry
export const jobCategories = {
  'Technology & Engineering': [
    'software-engineer', 'ai-ml-engineer', 'data-scientist', 'cybersecurity-specialist', 
    'cloud-architect', 'devops-engineer', 'mobile-app-developer', 'ui-ux-designer', 
    'qa-testing-engineer', 'database-administrator'
  ],
  'Sales & Marketing': [
    'sales-executive', 'business-development-manager', 'field-sales-executive', 
    'inside-sales-representative', 'key-account-manager', 'digital-marketing-specialist', 
    'content-writer', 'social-media-manager', 'seo-sem-specialist', 'brand-manager'
  ],
  'Finance & Accounting': [
    'accountant', 'financial-analyst', 'investment-banker', 'tax-consultant', 'credit-analyst'
  ],
  'Human Resources': [
    'hr-generalist', 'recruiter', 'training-development-specialist', 'compensation-benefits-analyst'
  ],
  'Service & Operations': [
    'delivery-executive', 'telecaller-customer-service', 'security-guard', 'factory-worker', 
    'warehouse-associate', 'driver-commercial'
  ],
  'Skilled Trades': [
    'electrician', 'plumber', 'carpenter', 'construction-worker'
  ],
  'Hospitality & Food Service': [
    'cook-chef', 'housekeeping-staff'
  ],
  'Healthcare': [
    'nurse', 'doctor-physician', 'pharmacist', 'medical-technologist'
  ],
  'Education': [
    'teacher-instructor', 'academic-counselor'
  ],
  'Engineering': [
    'mechanical-engineer', 'civil-engineer', 'electrical-engineer'
  ],
  'Management': [
    'project-manager', 'product-manager'
  ],
  'Legacy Categories': [
    'construction', 'manufacturing', 'delivery', 'housekeeping', 'security', 
    'driver', 'cook', 'waiter', 'welder', 'painter', 'mason', 
    'loader', 'gardener', 'mechanic', 'cleaner', 'helper', 'retail', 'cleaning', 'cooking', 'other'
  ]
};

// Flatten all categories for easy access
export const allJobRoles = Object.values(jobCategories).flat();

// Category display names mapping
export const categoryDisplayNames = {
  'software-engineer': 'Software Engineer',
  'ai-ml-engineer': 'AI/ML Engineer',
  'data-scientist': 'Data Scientist/Analyst',
  'cybersecurity-specialist': 'Cybersecurity Specialist',
  'cloud-architect': 'Cloud Architect/Engineer',
  'devops-engineer': 'DevOps Engineer',
  'mobile-app-developer': 'Mobile App Developer',
  'ui-ux-designer': 'UI/UX Designer',
  'qa-testing-engineer': 'QA/Testing Engineer',
  'database-administrator': 'Database Administrator',
  'sales-executive': 'Sales Executive',
  'business-development-manager': 'Business Development Manager',
  'field-sales-executive': 'Field Sales Executive',
  'inside-sales-representative': 'Inside Sales Representative',
  'key-account-manager': 'Key Account Manager',
  'digital-marketing-specialist': 'Digital Marketing Specialist',
  'content-writer': 'Content Writer/Creator',
  'social-media-manager': 'Social Media Manager',
  'seo-sem-specialist': 'SEO/SEM Specialist',
  'brand-manager': 'Brand Manager',
  'accountant': 'Accountant',
  'financial-analyst': 'Financial Analyst',
  'investment-banker': 'Investment Banker',
  'tax-consultant': 'Tax Consultant',
  'credit-analyst': 'Credit Analyst',
  'hr-generalist': 'HR Generalist',
  'recruiter': 'Recruiter',
  'training-development-specialist': 'Training & Development Specialist',
  'compensation-benefits-analyst': 'Compensation & Benefits Analyst',
  'delivery-executive': 'Delivery Executive',
  'telecaller-customer-service': 'Telecaller/Customer Service',
  'security-guard': 'Security Guard',
  'factory-worker': 'Factory Worker',
  'warehouse-associate': 'Warehouse Associate',
  'driver-commercial': 'Driver (Commercial)',
  'electrician': 'Electrician',
  'plumber': 'Plumber',
  'carpenter': 'Carpenter',
  'construction-worker': 'Construction Worker',
  'cook-chef': 'Cook/Chef',
  'housekeeping-staff': 'Housekeeping Staff',
  'nurse': 'Nurse',
  'doctor-physician': 'Doctor/Physician',
  'pharmacist': 'Pharmacist',
  'medical-technologist': 'Medical Technologist',
  'teacher-instructor': 'Teacher/Instructor',
  'academic-counselor': 'Academic Counselor',
  'mechanical-engineer': 'Mechanical Engineer',
  'civil-engineer': 'Civil Engineer',
  'electrical-engineer': 'Electrical Engineer',
  'project-manager': 'Project Manager',
  'product-manager': 'Product Manager'
};

// Job posting form constants
export const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Temporary', 'Both (Full-Time And Part-Time)'];
export const workLocationTypes = ['Work From Office', 'Work From Home', 'Field Job'];
export const payTypes = ['Fixed Only', 'Fixed + Incentive', 'Incentive Only'];

export const educationLevels = [
  '10th Or Below 10th', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate'
];

export const englishLevels = [
  'No English', 'Basic English', 'Good English'
];

export const experienceOptions = [
  'Any', 'Fresher Only', 'Experienced Only'
];

export const minExperienceOptions = [
  '6 Months', '1 Year', '2 Years', '3 Years', '5 Years', '10 Years'
];

export const additionalRequirements = [
  'Industry', 'Gender', 'Age', 'Regional Languages', 'Assets', 'Skills'
];

export const perks = [
  'Flexible Working Hours', 'Weekly Payout', 'Overtime Pay', 'Joining Bonus',
  'Annual Bonus', 'PF', 'Travel Allowance (TA)', 'Petrol Allowance',
  'Mobile Allowance', 'Internet Allowance', 'Laptop', 'Health Insurance',
  'ESI (ESIC)', 'Food/Meals', 'Accommodation', '5 Working Days',
  'One-Way Cab', 'Two-Way Cab'
];
