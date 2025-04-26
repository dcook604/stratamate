import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Card, Alert, Select } from 'antd';

const { Option } = Select;
const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811'}/auth/register`;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.post(API_URL, values);
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.toString());
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '2em auto' }}>
      <h2 style={{ textAlign: 'center' }}>Register</h2>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}
      {success && <Alert type="success" message="Registration successful! You can now log in." style={{ marginBottom: 16 }} showIcon />}
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="Name"
          name="full_name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Invalid email address' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }, { min: 6, message: 'Password must be at least 6 characters' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          initialValue="resident"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select>
            <Option value="resident">Resident</Option>
            <Option value="manager">Manager</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RegisterPage;
