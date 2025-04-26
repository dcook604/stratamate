import React, { useState } from 'react';
// import { createTicket } from '../api/api';

const TicketForm = ({ unitId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811'}/requests`, {
        unit_id: unitId,
        title,
        description,
      }, { headers });
      setSuccess(true);
      setTitle('');
      setDescription('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: '2em' }}>
      <h2>Submit Maintenance Ticket</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <br />
        <label>
          Description
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
        {success && <div className="alert-success">Ticket submitted!</div>}
        {error && <div className="alert-error">{error}</div>}
      </form>
    </div>
  );
};

export default TicketForm;
