import axios from 'axios';
import { remoteLogError } from '../utils/remoteLogger';
// Log error utility - logs to console and remote server
export function logError(context, error) {
  // eslint-disable-next-line no-console
  console.error(`[${context}]`, error);
  remoteLogError(context, error?.toString?.() || error);
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811';
const API_URL = `${API_BASE_URL}/auth`;

export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/token`, new URLSearchParams({
      username: email,
      password
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (err) {
    throw (err.response && err.response.data && err.response.data.detail) || 'Login failed';
  }
}

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}
