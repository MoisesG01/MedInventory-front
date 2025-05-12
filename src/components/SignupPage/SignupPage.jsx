import React, { useState } from 'react';
import { FaGoogle, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import './SignupPage.css';

const SignUp = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const strength = calculatePasswordStrength(newPassword);
        setPasswordStrength(strength);
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        return strength;
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2 className="signup-title">Create an account</h2>
                <div className="signup-fields">
                    <div className="signup-field">
                        <label>First Name*</label>
                        <input type="text" placeholder="Enter your first name" required/>
                    </div>
                    <div className="signup-field">
                        <label>Last Name*</label>
                        <input type="text" placeholder="Enter your last name" />
                    </div>
                    <div className="signup-field">
                        <label>Email*</label>
                        <input type="email" placeholder="Enter your email" />
                    </div>
                    <div className="signup-field">
                        <label>Contact Number*</label>
                        <input type="tel" placeholder="Enter your contact number" />
                    </div>
                    <div className="signup-checkbox-container">
                        <input type="checkbox" id="terms" className='checkbox-terms'/>
                        <label htmlFor="terms">By creating an account, I agree to our Terms of use and Privacy Policy</label>
                    </div>
                </div>

                <div className="signup-divider"></div>

                <div className="signup-password-section">
                    <h3 className='password-must-have'>Password must have:</h3>
                    <div className="signup-field">
                        <label>Password*</label>
                        <div className="signup-password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Enter your password"
                            />
                            <span onClick={toggleShowPassword} className="signup-toggle-password">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div className="signup-field">
                        <label>Confirm Password*</label>
                        <div className="signup-password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                            />
                            <span onClick={toggleShowPassword} className="signup-toggle-password">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div className="signup-password-validation">
                        <h3 className='password-validation-h3'>Password validation:</h3>
                        <div className="signup-validation-item">
                            <input type="checkbox" className='checkbox-terms' checked={passwordStrength >= 1} readOnly /> 8 characters or more
                        </div>
                        <div className="signup-validation-item">
                            <input type="checkbox" className='checkbox-terms' checked={passwordStrength >= 2} readOnly /> At least one special character
                        </div>
                        <div className="signup-validation-item">
                            <input type="checkbox" className='checkbox-terms' checked={passwordStrength >= 3} readOnly /> At least one number
                        </div>
                        <div className="signup-validation-item">
                            <input type="checkbox" className='checkbox-terms' checked={passwordStrength >= 4} readOnly /> At least one upper case character
                        </div>
                    </div>
                    <div className="signup-password-strength">
                        <h4>Password strength:</h4>
                        <div className={`signup-strength-dot ${passwordStrength >= 1 ? 'strong' : ''}`}></div>
                        <div className={`signup-strength-dot ${passwordStrength >= 2 ? 'strong' : ''}`}></div>
                        <div className={`signup-strength-dot ${passwordStrength >= 3 ? 'strong' : ''}`}></div>
                        <div className={`signup-strength-dot ${passwordStrength >= 4 ? 'strong' : ''}`}></div>
                    </div>
                </div>
                <h5>* Mandatory fields</h5>
                <button className="signup-button">Create Account</button>
                <div className="signup-sign-up-via">
                    <h3>Sign up via:</h3>
                    <div className="signup-sign-up-via-icons">
                        <FaGoogle className="icon" />
                        <FaEnvelope className="icon" />
                    </div>
                </div>
                <div className="signup-already-have-account">
                    <h3>Already have an account?</h3>
                    <a href="/login" className="already-have-account">Log in</a>
                </div>
            </div>
        </div>
    );
};

export default SignUp;