import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Onboarding from './pages/Onboarding.jsx';
import JobPost from './pages/JobPost.jsx';
import Dashboard from './pages/Dashboard.jsx';
import JobsList from './pages/JobsList.jsx';
import Applications from './pages/Applications.jsx';
import Profile from './pages/Profile.jsx';
import CandidateSearch from './pages/CandidateSearch.jsx';
import Layout from './components/Layout.jsx';

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/jobs/post" element={<JobPost />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Layout>
                  <JobsList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <JobPost />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:jobId/applications"
            element={
              <ProtectedRoute>
                <Layout>
                  <Applications />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <Layout>
                  <CandidateSearch />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
