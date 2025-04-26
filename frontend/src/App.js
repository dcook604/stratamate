import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import { getToken, logout as doLogout } from './api/auth';
import { Layout, Menu, Button } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  ApartmentOutlined,
  LogoutOutlined,
  LoginOutlined,
  FormOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import 'antd/dist/reset.css';
const { Header, Content, Footer } = Layout;

const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}


function Navbar() {
  const { isAuthenticated, handleLogout } = useAuth();
  const [user, setUser] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated) return setUser(null);
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8811';
        const res = await fetch(`${apiUrl}/auth/me`, { headers });
        if (!res.ok) throw new Error('Failed to fetch user');
        setUser(await res.json());
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
      hidden: !isAuthenticated,
    },
    {
      key: 'properties',
      icon: <ApartmentOutlined />,
      label: <Link to="/properties">Properties</Link>,
      hidden: !isAuthenticated || !(user?.role === 'manager' || user?.role === 'admin'),
    },
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: <Link to="/profile">Profile</Link>,
      hidden: !isAuthenticated,
    },
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: <Link to="/login">Login</Link>,
      hidden: isAuthenticated,
    },
    {
      key: 'register',
      icon: <FormOutlined />,
      label: <Link to="/register">Register</Link>,
      hidden: isAuthenticated,
    },
  ].filter(item => !item.hidden);

  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: 0 }}>
      <div style={{ width: 220, height: 64, display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: 22, marginLeft: 24 }}>
        <UserOutlined style={{ marginRight: 8, fontSize: 28, color: '#1677ff' }} /> StrataMate
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname.replace('/', '') || 'dashboard']}
        items={menuItems}
        style={{ flex: 1, minWidth: 0 }}
      />
      {isAuthenticated && (
        <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginRight: 24 }}>
          Logout
        </Button>
      )}
    </Header>
  );
}


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    doLogout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogout }}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Navbar />
          <Content style={{ maxWidth: 1100, margin: '32px auto', background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #f0f1f2' }}>
            <Routes>
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />
              } />
              <Route path="/register" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><UserProfilePage /></ProtectedRoute>
              } />
              <Route path="/properties" element={
                <ProtectedRoute><PropertiesPage /></ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<div className="card">Page not found.</div>} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
            StrataMate &copy; {new Date().getFullYear()} &mdash; Powered by Ant Design
          </Footer>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
