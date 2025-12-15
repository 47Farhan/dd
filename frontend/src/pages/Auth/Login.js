import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// Assuming the use of a separate CSS file for styling based on one conflict side
import './Auth.css'; // Add this line if you are using a separate CSS file for styling

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Combine all necessary state declarations
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate(); //useNavigate initialization

  const handleChange = (e) => { 
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    // Using the class-based structure, as it's cleaner than inline styles for a larger app
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
        
        {/* Display error message if present */}
        {error && <div className="error-message">{error}</div>} 
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <p className="register-link">
          Don't have an account? <Link to="/register" className="link">Register</Link>
        </p>
      </div>
    </div>
  );
};

// The styles object is for the inline-style version, 
// which is no longer used in the returned JSX, but you might need it for reference.
/* const styles = { ... }; 
*/

export default Login;