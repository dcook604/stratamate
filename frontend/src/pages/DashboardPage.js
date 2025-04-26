import React, { useEffect, useState } from 'react';
import { getToken } from '../api/auth';
import axios from 'axios';
import { Card, Typography, Row, Col, Alert } from 'antd';
const { Title, Text } = Typography;

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const [userRes, propertiesRes, ticketsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811'}/auth/me`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811'}/units`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811'}/requests`, { headers }),
        ]);
        setDashboard({
          user: userRes.data,
          propertyCount: propertiesRes.data.length,
          unitCount: propertiesRes.data.reduce((sum, p) => sum + (p.units ? p.units.length : 0), 0),
          ticketCount: ticketsRes.data.length,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard');
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="alert-error">{error}</div>;
  if (!dashboard) return null;

  return (
    <Card style={{ maxWidth: 700, margin: '2em auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Dashboard</Title>
      {loading && <Text>Loading...</Text>}
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}
      {dashboard && (
        <>
          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <Title level={4}>Properties</Title>
                <Text style={{ fontSize: 28 }}>{dashboard.propertyCount}</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <Title level={4}>Units</Title>
                <Text style={{ fontSize: 28 }}>{dashboard.unitCount}</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <Title level={4}>Tickets</Title>
                <Text style={{ fontSize: 28 }}>{dashboard.ticketCount}</Text>
              </Card>
            </Col>
          </Row>
          <Text>Welcome, {dashboard.user?.name || dashboard.user?.email}!</Text>
        </>
      )}
    </Card>
  );
};

export default DashboardPage;
