import React, { useEffect, useState } from 'react';
import { getToken } from '../api/auth';
import axios from 'axios';

const UnitList = ({ propertyId, onSelect, onEdit }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811'}/units/${propertyId}`, { headers });
        // If property object contains units, use them; else, fallback to empty
        setUnits(res.data.units || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load units');
        setLoading(false);
      }
    };
    if (propertyId) fetchUnits();
  }, [propertyId]);

  if (loading) return <div>Loading units...</div>;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div className="card">
      <h2>Units</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {units.map((unit) => (
          <li key={unit.id} style={{ marginBottom: '1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '1em' }}>
            <div>
              <strong>Unit {unit.number}</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em' }}>
              {onSelect && (
                <button onClick={() => onSelect(unit)}>
                  View Tickets
                </button>
              )}
              {onEdit && (
                <button onClick={() => onEdit(unit)} style={{ background: 'var(--color-accent-blue)' }}>
                  Edit
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnitList;
