// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    ripple.classList.add('ripple');
    
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 400);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      // Check if credentials match the specific user
      if (email === "leah.evangelista@deltaplus.ph" && password === "deltaplus") {
        // Store authentication state
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        
        // Redirect to database page
        navigate("/database");
        
        // Clear form and error
        setEmail("");
        setPassword("");
        setError("");
      } else {
        setError("Invalid credentials. Access denied.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo at top */}
        <div className="logo-section">
          <img 
            src="/deltaplus.png" 
            alt="Deltaplus" 
            className="login-logo"
          />
        </div>

        {/* Login Form */}
        <div className="form-section">
          <div className="form-header">
            <h2 className="form-title">Admin Login</h2>
            <p className="form-subtitle">Please enter your credentials</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">!</span>
              <div className="error-content">
                <strong>Login Failed</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-footer">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
                onMouseDown={createRipple}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
              <p className="form-note">Authorized personnel only</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;