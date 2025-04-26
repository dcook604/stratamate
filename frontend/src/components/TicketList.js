import React, { useEffect, useState } from 'react';
import { getToken } from '../api/auth';
import axios from 'axios';

const TicketList = ({ unitId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8811'}/requests`, { headers });
        let tickets = res.data;
        if (unitId) {
          tickets = tickets.filter(ticket => ticket.unit_id === unitId);
        }
        setTickets(tickets);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tickets');
        setLoading(false);
      }
    };
    fetchTickets();
  }, [unitId]);

  if (loading) return <div>Loading tickets...</div>;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div className="card">
      <h2>Maintenance Tickets</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tickets.map((ticket) => (
          <li key={ticket.id} style={{ marginBottom: '1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '1em' }}>
            <div>
              <strong>{ticket.title}</strong> <span style={{ color: 'var(--color-accent-blue)' }}>[{ticket.status}]</span><br />
              <span>Created: {ticket.created_at}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketList;
