import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <h1>User Profile</h1>
          {user ? (
            <div className="profile-info">
              <div className="profile-field">
                <label>Name:</label>
                <span>{user.name}</span>
              </div>
              <div className="profile-field">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="profile-field">
                <label>Role:</label>
                <span>{user.role}</span>
              </div>
            </div>
          ) : (
            <p>Please log in to view your profile.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;