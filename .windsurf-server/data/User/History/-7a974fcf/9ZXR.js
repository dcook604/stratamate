from fastapi import Request
from fastapi.responses import Response

@app.middleware("http")
async def add_private_network_header(request: Request, call_next):
    response = await call_next(request)
    # Only add for OPTIONS preflight requests
    if request.method == "OPTIONS":
        response.headers["Access-Control-Allow-Private-Network"] = "true"
    return responseimport axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8811';
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
