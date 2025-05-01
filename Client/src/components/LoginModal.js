import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const LoginModal = ({ setShowLoginModal }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);  // New state to toggle between login and register
  const { login } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userName && password) {
      // Send login request to backend
      try {
        const response = await fetch('http://localhost:5042/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName, password }),
        });

        if (!response.ok) {
          alert('InvalId login credentials.');
          return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token); // Store JWT token in localStorage
        login();  // Context method to handle login state
        alert('Login successful!');
        setShowLoginModal(false);
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred while logging in.');
      }
    } else {
      alert('Please enter both userName and password.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (userName && password) {
      // Send register request to backend
      try {
        const response = await fetch('http://localhost:5042/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          alert(error || 'Registration failed.');
          return;
        }

        alert('Registration successful! Please log in.');
        setIsRegistering(false); // Switch to login mode after successful registration
      } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred while registering.');
      }
    } else {
      alert('Please enter both userName and password.');
    }
  };

  const closeModal = () => {
    setShowLoginModal(false); // Manual close
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal">
        <button className="close-btn" onClick={closeModal}>×</button>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <div className="mb-3">
            <label>UserName</label>
            <input
              type="text"
              className="form-control"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your userName"
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        {/* Switch to Registration mode if not in it */}
        <p className="mt-3 text-center">
          {isRegistering ? 'Already have an account? ' : 'Don\'t have an account? '}
          <button 
            className="btn btn-link" 
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
