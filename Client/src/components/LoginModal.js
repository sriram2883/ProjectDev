import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const LoginModal = ({ setShowLoginModal }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);  // Login as Admin flag
  const { login, setIsAdmin } = useContext(AppContext);

  // Handle the login process
  const handleLogin = async (e) => {
    e.preventDefault();
    if (userName && password) {
      try {
        const response = await fetch('https://backendsriram.azurewebsites.net/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName, password, loginAsAdmin }),  // Pass loginAsAdmin flag
        });

        if (!response.ok) {
          alert('Invalid login credentials or insufficient permissions.');
          return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);  // Store JWT token in localStorage

        // Set admin state in context based on response role
        setIsAdmin(data.role === 'admin');  // Update context with admin status

        login();  // Call context's login method to set logged in state
        alert('Login successful!');
        setShowLoginModal(false); // Close the modal on successful login
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred while logging in.');
      }
    } else {
      alert('Please enter both userName and password.');
    }
  };

  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (userName && password) {
      try {
        const response = await fetch('https://backendsriram.azurewebsites.net/api/auth/register', {
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

  // Close modal
  const closeModal = () => {
    setShowLoginModal(false); // Manually close the modal
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

          {/* Only show "Login as Admin" checkbox if not in registration mode */}
          {!isRegistering && (
            <div className="mb-3">
              <label>
                <input
                  type="checkbox"
                  checked={loginAsAdmin}
                  onChange={() => setLoginAsAdmin(!loginAsAdmin)}
                />
                Login as Admin
              </label>
            </div>
          )}

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
