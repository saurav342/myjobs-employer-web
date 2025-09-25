import api from './api.js';

export async function updateApplicationStatus(applicationId, { status, feedback, interviewDetails }) {
  const payload = { status };
  if (feedback) payload.feedback = feedback;
  if (interviewDetails) payload.interviewDetails = interviewDetails;
  const { data } = await api.put(`/applications/${applicationId}/status`, payload);
  return data;
}

