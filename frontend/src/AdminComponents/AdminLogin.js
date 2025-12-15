import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() }),
      });
      console.log(response) 
      const contentType = response.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) {
          setError(text || 'Proxy error. Is the backend running on port 5000?');
          return;
        } else {
          setError('Unexpected non-JSON response from server');
          return;
        }
      }

      if (response.ok && data?.user?.role === 'admin') {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        navigate('/admin');
      } else {
        setError(data.message || 'Login failed. Make sure you have admin privileges.');
      }
    } catch (error) {
      setError('Network error. Please check if the backend server is running.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    container: {
      background: 'white',
      padding: '3rem',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      width: '100%',
      maxWidth: '450px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    headerH1: {
      margin: '0 0 0.5rem 0',
      color: '#2c3e50',
      fontSize: '2rem',
      fontWeight: '600'
    },
    headerP: {
      margin: '0',
      color: '#7f8c8d',
      fontSize: '1rem'
    },
    form: {
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#2c3e50',
      fontSize: '0.9rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '2px solid #e0e0e0',
      borderRadius: '6px',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    buttonDisabled: {
      background: '#bdc3c7',
      cursor: 'not-allowed'
    },
    error: {
      background: '#fee',
      color: '#c53030',
      padding: '0.75rem 1rem',
      borderRadius: '6px',
      marginBottom: '1.5rem',
      border: '1px solid #fed7d7',
      fontSize: '0.9rem'
    },
    demoInfo: {
      background: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '6px',
      border: '1px solid #e9ecef',
      textAlign: 'center'
    },
    demoText: {
      margin: '0.25rem 0',
      color: '#6c757d',
      fontSize: '0.9rem'
    },
    demoTitle: {
      fontWeight: '600',
      color: '#495057',
      marginBottom: '0.5rem'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerH1}>Admin Panel</h1>
          <p style={styles.headerP}>Sign in to access the dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={styles.input}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div style={styles.demoInfo}>
          <p style={{...styles.demoText, ...styles.demoTitle}}>
            <strong>Note:</strong> Use your actual admin credentials
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
