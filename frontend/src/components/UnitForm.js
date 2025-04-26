import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../api/auth';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811'}/units`;

const UnitForm = ({ propertyId, unit, onSuccess }) => {
  const [number, setNumber] = useState(unit ? unit.number : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (unit) setNumber(unit.number);
  }, [unit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (unit) {
        // Edit unit
        await axios.put(`${API_URL}/${unit.id}`, { number }, { headers });
      } else {
        // Add unit
        await axios.post(API_URL, { number, property_id: propertyId }, { headers });
      }
      setSuccess(true);
      setNumber('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>{unit ? 'Edit Unit' : 'Add Unit'}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Unit Number
          <input value={number} onChange={e => setNumber(e.target.value)} required />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? (unit ? 'Saving...' : 'Adding...') : unit ? 'Save Changes' : 'Add Unit'}
        </button>
        {success && <div className="alert-success">Unit saved!</div>}
        {error && <div className="alert-error">{error}</div>}
      </form>
    </div>
  );
};

export default UnitForm;
