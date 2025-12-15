import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const userData = localStorage.getItem('adminUser');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.role === 'admin') {
            setUser(parsedUser);
          } else {
            // Not an admin, redirect to login
            navigate('/admin/login');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          navigate('/admin/login');
        }
      } else {
        // No token or user data, redirect to login
        navigate('/admin/login');
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    navigate('/admin/login');
  };

  return { user, loading, logout };
};