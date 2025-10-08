# Test Users Guide for Employer-Web

## Quick Start

### Test User 1: TechCorp Solutions
**Perfect for testing enterprise-level job postings**

- **Phone Number**: `9876543210`
- **Password**: `techcorp123`
- **Company**: TechCorp Solutions
- **Location**: Bangalore, Karnataka
- **Employee Count**: 100-500 employees
- **Company Type**: Non-consultancy

**Test Scenarios:**
- Post technology jobs (Software Engineer, Data Scientist, etc.)
- Test enterprise-level job requirements
- Verify company profile management
- Test bulk job operations

### Test User 2: StartupX Innovations
**Perfect for testing startup and consultancy job postings**

- **Phone Number**: `9876543211`
- **Password**: `startupx123`
- **Company**: StartupX Innovations
- **Location**: Mumbai, Maharashtra
- **Employee Count**: 10-50 employees
- **Company Type**: Consultancy

**Test Scenarios:**
- Post diverse job categories (Sales, Marketing, HR, etc.)
- Test startup-specific job requirements
- Verify consultancy job postings
- Test flexible work arrangements

## Login Process

1. **Open Employer-Web**: Navigate to the employer web application
2. **Enter Phone**: Use one of the test phone numbers above
3. **Request OTP**: Click "Send OTP"
4. **Enter OTP**: Use `1234` as the OTP (for testing)
5. **Complete Login**: You'll be logged in as the respective employer

## Testing the New Job Categories

### Technology & Engineering Jobs
- Software Engineer
- AI/ML Engineer
- Data Scientist
- Cybersecurity Specialist
- Cloud Architect
- DevOps Engineer
- Mobile App Developer
- UI/UX Designer
- QA/Testing Engineer
- Database Administrator

### Sales & Marketing Jobs
- Sales Executive
- Business Development Manager
- Field Sales Executive
- Inside Sales Representative
- Key Account Manager
- Digital Marketing Specialist
- Content Writer/Creator
- Social Media Manager
- SEO/SEM Specialist
- Brand Manager

### Other Categories
- Finance & Accounting roles
- Human Resources positions
- Service & Operations jobs
- Skilled Trades
- Hospitality & Food Service
- Healthcare positions
- Education roles
- Engineering positions
- Management roles

## Job Posting Workflow Test

1. **Login** with test credentials
2. **Navigate** to "Post Job" from dashboard
3. **Select Category** from the new categorized dropdown
4. **Fill Job Details**:
   - Job title and role
   - Job type (Full Time, Part Time, etc.)
   - Work location type
   - Salary range
   - Additional perks
5. **Set Requirements**:
   - Minimum education
   - English level
   - Experience requirements
   - Additional requirements
6. **Configure Interview**:
   - Walk-in interview settings
   - Address and timing
   - Communication preferences
7. **Preview & Post**:
   - Review all details
   - Save as draft or post immediately

## Expected Results

- **Category Selection**: Should see organized dropdown with industry groups
- **Display Names**: Categories should show user-friendly names
- **Form Validation**: All fields should validate correctly
- **Job Creation**: Jobs should be created with new category structure
- **Backend Compatibility**: Jobs should save to database successfully

## Troubleshooting

### If Login Fails
- Ensure you're using the correct phone numbers
- Use OTP `1234` for testing
- Check that the backend is running

### If Categories Don't Load
- Check browser console for errors
- Verify the constants file is imported correctly
- Ensure the backend supports the new categories

### If Job Creation Fails
- Check that all required fields are filled
- Verify the backend model supports new fields
- Check network requests in browser dev tools

## Database Verification

To verify jobs are created correctly:

1. **Check MongoDB**: Look for jobs with new category values
2. **Verify Fields**: Ensure enhanced fields are saved
3. **Test Queries**: Verify category-based filtering works

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify backend logs
3. Test with both test users
4. Check the comprehensive documentation in `JOB_POSTING_REVAMP.md`
