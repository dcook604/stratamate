import React, { useEffect, useState } from 'react';
import { getToken } from '../api/auth';
import axios from 'axios';

const PropertyList = ({ onSelect }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811'}/units`, { headers });
        setProperties(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load properties');
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div className="card">
      <h2>Properties</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {properties.map((property) => (
          <li key={property.id} style={{ marginBottom: '1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '1em' }}>
            <div>
              <strong>{property.name}</strong><br />
              <span>{property.address}</span>
            </div>
            {onSelect && (
              <button style={{ marginTop: '0.5em' }} onClick={() => onSelect(property)}>
                Manage Units
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
