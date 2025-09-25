import api from './api.js';

export async function searchCandidates(filters = {}, { page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams();
  Object.entries({ ...filters, page, limit }).forEach(([k,v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) params.append(k, v.join(',')); else params.append(k, v);
  });
  const { data } = await api.get(`/employers/candidates?${params.toString()}`);
  return data?.data || { candidates: [], pagination: {} };
}

export async function getCredits() {
  const { data } = await api.get('/employers/credits');
  return data?.data?.credits ?? 0;
}

export async function addCredits(amount) {
  const { data } = await api.post('/employers/credits/add', { amount });
  return data?.data?.credits ?? 0;
}

export async function revealContact(candidateId) {
  const { data } = await api.post('/employers/reveal-contact', { candidateId });
  return data;
}

export async function getSavedSearches() {
  const { data } = await api.get('/employers/saved-searches');
  return data?.data?.searches || [];
}

export async function saveSearch(name, filters) {
  const { data } = await api.post('/employers/saved-searches', { name, filters });
  return data?.data;
}

export async function deleteSavedSearch(id) {
  const { data } = await api.delete(`/employers/saved-searches/${id}`);
  return data?.success;
}

export async function updateTags(candidateId, tags) {
  const { data } = await api.put(`/employers/candidates/${candidateId}/tags`, { tags });
  return data?.data?.tags || [];
}

export async function addNote(candidateId, text) {
  const { data } = await api.post(`/employers/candidates/${candidateId}/notes`, { text });
  return data?.data?.notes || [];
}

export async function sendMessages(candidateIds, templateId, paramsByCandidate) {
  const { data } = await api.post('/employers/messages/send', { candidateIds, templateId, paramsByCandidate });
  return data?.data || { sent: 0, failed: 0 };
}

export async function createInterview(payload) {
  const { data } = await api.post('/employers/interviews', payload);
  return data?.data;
}

export async function listInterviews() {
  const { data } = await api.get('/employers/interviews');
  return data?.data?.interviews || [];
}
