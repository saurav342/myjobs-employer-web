# Employer Web (happyjobs)

A lightweight React web app for employers with OTP-only login and city-based job posting.

## Highlights
- OTP login only (no passwords). Uses existing `/api/auth/send-otp` and `/api/auth/verify-otp`.
- If the phone isn’t registered, a small employer profile form creates the account with `userType: employer` (a strong password is generated client-side just to satisfy the API; users don’t need it).
- Post jobs with required fields and city/state. Jobs are matched by city for seekers.
- View “My Jobs” and see applications per job.

## Structure
- `src/pages/Login.jsx` — OTP flow
- `src/pages/Register.jsx` — Employer profile creation (OTP-only model)
- `src/pages/JobsNew.jsx` — Post a job (title, company, category, type, description, city/state, salary)
- `src/pages/JobsList.jsx` — List employer’s jobs
- `src/pages/Applications.jsx` — Applications for a job
- `src/contexts/AuthContext.jsx` — Token + user session using `localStorage`
- `src/services/api.js` — Axios instance with `Authorization` header

## Backend endpoints used
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/register` (with `userType: employer`)
- `GET  /api/jobs/employer/my-jobs`
- `POST /api/jobs`
- `GET  /api/applications/job/:jobId`

## Configure and run
1. Set the API base URL (optional). Create `.env` in `employer-web/`:

```
VITE_API_BASE_URL=https://ec2-16-176-22-21.ap-southeast-2.compute.amazonaws.com:3000/api
```

For local development, you can use HTTP:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

**Important**: Use HTTPS URLs for production deployments to avoid mixed content security issues. Without the `.env` file, it defaults to the HTTPS EC2 URL.

2. Install and run:

```
npm install
npm run dev
```

Visit `http://localhost:5174`.

## Notes
- This app does not modify the job-seeker logic.
- City is the primary matching attribute. Ensure city/state are set on job posts.
- CORS: backend currently allows `*` or `FRONTEND_URL`. Update as needed for production.
# myjobs-employer-web
