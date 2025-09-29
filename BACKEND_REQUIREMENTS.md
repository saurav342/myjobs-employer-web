# Backend Service Requirements for Happy Jobs Employer Web

## Overview
This document outlines the complete API requirements for the Happy Jobs Employer Web application backend service.

## Base Configuration
- **Base URL**: `http://ec2-16-176-22-21.ap-southeast-2.compute.amazonaws.com:3000/api`
- **Authentication**: JWT Bearer tokens
- **Content-Type**: `application/json`

## Authentication Endpoints

### 1. Send OTP
```
POST /auth/send-otp
Body: { "phoneNumber": "9012121212" }
Response: { "success": true, "message": "OTP sent successfully" }
```

### 2. Verify OTP
```
POST /auth/verify-otp  
Body: { "phoneNumber": "9012121212", "otp": "1234" }
Response: {
  "success": true,
  "isRegistered": true|false,
  "token": "jwt-token-string",
  "user": {
    "id": "user-id",
    "fullName": "User Name",
    "email": "user@example.com", 
    "phoneNumber": "9012121212",
    "userType": "employer",
    "companyName": "Company Name",
    "location": { "city": "City", "state": "State" }
  }
}
```

### 3. Register Employer
```
POST /auth/register
Body: {
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "9012121212", 
  "password": "auto-generated-password",
  "userType": "employer"
}
Response: {
  "success": true,
  "token": "jwt-token",
  "user": { /* user object */ }
}
```

### 4. Employer Onboarding
```
PUT /auth/employer/onboarding
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "companyName": "Test Company",
  "location": { "city": "Bangalore", "state": "Karnataka" },
  "employeeCount": "10-50", 
  "isConsultancy": false
}
Response: { "success": true, "data": { /* updated profile */ } }
```

## Job Management Endpoints

### 5. Get Job Templates
```
GET /jobs/templates
Response: {
  "data": {
    "templates": [
      { "id": 1, "title": "Software Developer", "role": "Software Development", ... }
    ]
  }
}
```

### 6. Create Job Posting  
```
POST /jobs
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "companyName": "Test Company",
  "jobTitle": "Software Developer",
  "jobRole": "Software Development",
  "jobType": "Full Time",
  "workLocationType": "Work From Office",
  "jobCity": "Bangalore",
  "payType": "Fixed Only",
  "fixedSalaryMin": "30000",
  "fixedSalaryMax": "50000",
  "additionalPerks": ["Health Insurance", "PF"],
  "requirements": {
    "education": "Graduate",
    "experience": "1-3 years",
    "englishLevel": "Good English"
  },
  "description": "Job description text"
}
Response: { "success": true, "data": { "jobId": "job-id", ... } }
```

### 7. Get My Jobs
```
GET /jobs/employer/my-jobs?limit=20
Headers: { "Authorization": "Bearer <token>" }
Response: {
  "data": {
    "jobs": [
      {
        "_id": "job-id", 
        "jobTitle": "Software Developer",
        "status": "active",
        "applicationsCount": 5,
        "createdAt": "2025-09-29T10:00:00.000Z"
      }
    ]
  }
}
```

### 8. Update Job Status
```
PUT /jobs/{jobId}
Headers: { "Authorization": "Bearer <token>" }  
Body: { "status": "active"|"paused"|"closed" }
Response: { "success": true, "data": { /* updated job */ } }
```

## Application Management Endpoints

### 9. Get Job Applications
```
GET /applications/job/{jobId}
Headers: { "Authorization": "Bearer <token>" }
Response: {
  "data": {
    "applications": [
      {
        "_id": "app-id",
        "candidate": {
          "name": "John Doe",
          "phone": "9876543210", 
          "email": "john@example.com",
          "experience": "2 years"
        },
        "status": "applied|shortlisted|interviewed|hired|rejected",
        "appliedAt": "2025-09-29T10:00:00.000Z"
      }
    ]
  }
}
```

### 10. Update Application Status
```
PUT /applications/{applicationId}/status
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "status": "shortlisted|interviewed|hired|rejected",
  "feedback": "Optional feedback text",
  "interviewDetails": {
    "date": "2025-10-01",
    "time": "10:00 AM",
    "venue": "Office/Online"
  }
}
Response: { "success": true, "data": { /* updated application */ } }
```

### 11. Add Application Activity
```
POST /applications/{applicationId}/activity
Headers: { "Authorization": "Bearer <token>" }
Body: { "type": "viewed|contacted|noted" }
Response: { "success": true }
```

## Candidate Search & Management Endpoints

### 12. Search Candidates
```
GET /employers/candidates?page=1&limit=20&role=developer&location=bangalore&experience=1-3
Headers: { "Authorization": "Bearer <token>" }
Response: {
  "data": {
    "candidates": [
      {
        "id": "candidate-id",
        "name": "Jane Doe", 
        "role": "Software Developer",
        "experience": "2 years",
        "location": "Bangalore",
        "skills": ["React", "Node.js"]
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 100 }
  }
}
```

### 13. Get Credits Balance
```
GET /employers/credits
Headers: { "Authorization": "Bearer <token>" }
Response: { "data": { "credits": 50 } }
```

### 14. Add Credits
```
POST /employers/credits/add
Headers: { "Authorization": "Bearer <token>" }
Body: { "amount": 100 }
Response: { "data": { "credits": 150 } }
```

### 15. Reveal Contact Information
```
POST /employers/reveal-contact
Headers: { "Authorization": "Bearer <token>" }
Body: { "candidateId": "candidate-id" }
Response: {
  "success": true,
  "data": {
    "phone": "9876543210",
    "email": "candidate@example.com"
  }
}
```

### 16. Saved Searches Management
```
GET /employers/saved-searches
POST /employers/saved-searches
DELETE /employers/saved-searches/{id}

Body for POST: { "name": "Search Name", "filters": { /* search filters */ } }
```

### 17. Candidate Tags & Notes
```
PUT /employers/candidates/{candidateId}/tags
Body: { "tags": ["interested", "experienced"] }

POST /employers/candidates/{candidateId}/notes  
Body: { "text": "Good candidate, follows up well" }
```

### 18. Messaging & Communication
```
POST /employers/messages/send
Body: {
  "candidateIds": ["id1", "id2"],
  "templateId": "template-id", 
  "paramsByCandidate": { "id1": { "name": "John" } }
}
```

### 19. Interview Management
```
GET /employers/interviews
POST /employers/interviews
Body: {
  "candidateId": "candidate-id",
  "jobId": "job-id", 
  "scheduledAt": "2025-10-01T10:00:00.000Z",
  "venue": "Office Conference Room",
  "type": "technical|hr|final"
}
```

## Response Format Standards

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response  
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

## Authentication Flow
1. User enters phone number → `POST /auth/send-otp`
2. User enters OTP → `POST /auth/verify-otp` 
3. If `isRegistered: false` → redirect to registration → `POST /auth/register` + `PUT /auth/employer/onboarding`
4. If `isRegistered: true` → login with returned token
5. All subsequent requests include `Authorization: Bearer <token>` header

## Test Data Requirements
For development/testing, the backend should support:
- Test phone: `9012121212` 
- Test OTP: `1234`
- Should return mock data for all endpoints when using test credentials

## Environment Variables Needed
```env
DATABASE_URL=mongodb://...
JWT_SECRET=your-jwt-secret
SMS_API_KEY=your-sms-provider-key
AWS_ACCESS_KEY=your-aws-key (if using AWS)
PORT=3000
```

## CORS Configuration
Allow origins:
- `http://localhost:5174` (development)
- `https://*.netlify.app` (production)
- Your custom domain