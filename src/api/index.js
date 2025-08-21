import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ------- Assessments -------
export const getAssessmentsAPI = () => API.get('/assessments');
export const getAssessmentByIdAPI = (id) => API.get(`/assessments/${id}`);
export const createAssessmentAPI = (data) =>
  API.post('/assessments', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateAssessmentAPI = (id, data) =>
  API.put(`/assessments/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteAssessmentAPI = (id) => API.delete(`/assessments/${id}`);
export const duplicateAssessmentAPI = (id) => API.post(`/assessments/${id}/duplicate`);

// ------- Leads -------
export const getLeadsAPI = () => API.get('/leads');
export const createLeadAPI = (data) => API.post('/leads', data);
export const updateLeadAPI = (id, data) => API.put(`/leads/${id}`, data);
export const addTagToLeadAPI = (id, tagData) => API.post(`/leads/${id}/tags`, tagData);

// ------- Voice Settings -------
export const getVoiceSettingsAPI = () => API.get('/voicesettings');
export const updateVoiceSettingsAPI = (data) => API.put('/voicesettings', data);

export default API;