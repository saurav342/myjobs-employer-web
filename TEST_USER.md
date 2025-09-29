# Test User Configuration

## Test User Credentials
- **Phone Number**: 9012121212  
- **OTP**: 1234

## How to Use Test User

1. **Development Mode**: The test user is automatically available in development mode when running `npm run dev`

2. **Login Process**:
   - Enter phone number: `9012121212`
   - Click "Send OTP" - you'll see "OTP sent successfully (test mode)"
   - Enter OTP: `1234`
   - Click "Verify OTP" - you'll be logged in automatically

3. **Test User Profile**:
   - Name: Test Employer
   - Email: test@example.com
   - Company: Test Company
   - Location: Test City, Test State
   - Employee Count: 10-50
   - Type: Direct Employer (not consultancy)

## Configuration

The test user can be configured via environment variables in `.env.development`:

```env
VITE_TEST_MODE=true
VITE_TEST_PHONE=9012121212
VITE_TEST_OTP=1234
```

## Disabling Test Mode

To disable test mode, either:
1. Set `VITE_TEST_MODE=false` in `.env.development`
2. Remove the `.env.development` file
3. Deploy to production (test mode only works in development)