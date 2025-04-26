import React, { useState } from 'react';
import { login } from '../api/auth';
import { Form, Input, Button, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../assets/logo.png';

const LoginPage = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.email, values.password);
      setLoading(false);
      if (onLogin) onLogin();
    } catch (err) {
      setError(err.toString());
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '2em auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5em' }}>
        <img src={logo} alt="StrataMate Logo" style={{ width: 120, height: 120, objectFit: 'contain' }} />
      </div>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Invalid email address' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }, { min: 6, message: 'Password must be at least 6 characters' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginPage;
