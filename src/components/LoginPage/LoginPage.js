import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaLock } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="signup-section">
          <h2>Sign up</h2>
          <button className="google-btn">
            <FaGoogle /> Continue with Google
          </button>
          <button className="email-btn"> <FaEnvelope /> Sign up with email</button>
          <p>
            By signing up, you agree to the <a className='term' href="/terms">Terms of Service</a> and
            acknowledge you've read our <a className='term' href="/terms">Privacy Policy</a>.
          </p>
        </div>
        <div className="divider"></div>
        <div className="login-section">
          <h2>Log in</h2>
          <form>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input type="email" id="email" placeholder="Enter your email" required />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password" required
                />
                {showPassword ? (
                  <FaEye onClick={togglePasswordVisibility} className="toggle-password" />
                ) : (
                  <FaEyeSlash onClick={togglePasswordVisibility} className="toggle-password" />
                )}
              </div>
            </div>
            <button type="submit" className="login-btn-in">Log in</button>
          </form>
          <a href="/forgot-password" className="forgot-password">Forgot your password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;