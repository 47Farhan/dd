import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // Initialize state based on the safe retrieval of userData from localStorage
  const initializeUser = () => {
    const userDataString = localStorage.getItem('userData');

    // Check if the string exists AND is not the problematic literal string "undefined"
    if (userDataString && userDataString !== "undefined") {
      try {
        // Return the parsed user object
        return JSON.parse(userDataString);
      } catch (e) {
        // If data is corrupt, clean up localStorage and log the error
        console.error("Error parsing user data during initialization:", e);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        return null; // Return null if parsing fails
      }
    }
    return null; // Return null if no data is found
  };
    
  // State Initialization: Run the safe initialization function only once
  const [user, setUser] = useState(initializeUser);
  const [loading, setLoading] = useState(true);

  // useEffect is now only needed to set loading to false after the initial check.
  // The state is already initialized above using initializeUser().
  useEffect(() => {
    // A small delay (optional) to ensure all initial render cycles complete
    // before declaring the context ready.
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: Store user data safely
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: Store user data safely
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    register,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Show children only when loading is complete */}
      {!loading ? children : <div>Loading authentication...</div>}
    </AuthContext.Provider>
  );
};