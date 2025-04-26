import React, { useEffect, useState } from 'react';
import { getToken } from '../api/auth';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811'}/auth/me`;
const UPDATE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811'}/auth/me`; // Adjust if needed

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(API_URL, { headers });
        setUser(res.data);
        setFullName(res.data.full_name);
      } catch (err) {
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(UPDATE_URL, { full_name: fullName }, { headers });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="alert-error">{error}</div>;
  if (!user) return null;

  return (
    <div className="card">
      <h2>User Profile</h2>
      <form onSubmit={handleSave}>
        <label>
          Email
          <input value={user.email} disabled />
        </label>
        <br />
        <label>
          Full Name
          <input value={fullName} onChange={e => setFullName(e.target.value)} required />
        </label>
        <br />
        <label>
          Role
          <input value={user.role} disabled />
        </label>
        <br />
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {success && <div className="alert-success">Profile updated!</div>}
        {error && <div className="alert-error">{error}</div>}
      </form>
    </div>
  );
};

export default UserProfilePage;
