import React, { useState } from 'react';
// import { createProperty } from '../api/api';

const PropertyForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    // createProperty({ name, address })
    //   .then(() => {
    //     setSuccess(true);
    //     setName('');
    //     setAddress('');
    //     if (onSuccess) onSuccess();
    //   })
    //   .catch(() => setError('Failed to create property'))
    //   .finally(() => setLoading(false));
    setTimeout(() => {
      setSuccess(true);
      setName('');
      setAddress('');
      setLoading(false);
      if (onSuccess) onSuccess();
    }, 400);
  };

  return (
    <div className="card" style={{ marginTop: '2em' }}>
      <h2>Add Property</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <br />
        <label>
          Address
          <input value={address} onChange={e => setAddress(e.target.value)} required />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Property'}
        </button>
        {success && <div className="alert-success">Property added!</div>}
        {error && <div className="alert-error">{error}</div>}
      </form>
    </div>
  );
};

export default PropertyForm;
