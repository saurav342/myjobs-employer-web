import api from './api.js';

export async function getTemplates() {
  const { data } = await api.get('/jobs/templates');
  return data?.data?.templates || [];
}

