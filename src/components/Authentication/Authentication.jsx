import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Authentication.scss';

const Authentication = ({ setToken }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSignUp) {
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            try {
                const response = await axios.post("http://localhost:8080/signup", {
                    username,
                    password
                });
                setToken({ token: response.data.accessToken, userId: response.data.userId });
            } catch (error) {
                console.log("Error happened while signing up: ", error);
            }
        } else {
            try {
                const response = await axios.post("http://localhost:8080/login", {
                    username,
                    password
                });
                setToken({ token: response.data.accessToken, userId: response.data.userId });
                navigate('/home');
            } catch (error) {
                console.log("Error happened while logging in: ", error);
            }
        }
    };

    return (
        <div className="auth">
            <div className="auth__left">
                <div className="auth__text">
                    <h2 className="auth__title">ScamShield</h2>
                    <h1 className="auth__heading">Protect your users from scam messages instantly</h1>
                    <p className="auth__description">
                        Use ScamShield and secure your messages with real-time scam detection. Sign up now and protect your personal information with ease.
                    </p>
                    <div className="auth__buttons">
                        <button className="auth__button" onClick={() => setIsSignUp(false)}>Log In</button>
                        <button className="auth__button" onClick={() => setIsSignUp(true)}>Sign Up</button>
                    </div>
                </div>
            </div>
            <div className="auth__right">
                <div className="auth__form-container">
                    <h2 className="auth__form-title">{isSignUp ? 'Sign Up' : 'Log In'}</h2>
                    <form className="auth__form" onSubmit={handleSubmit}>
                        <label className="auth__label">
                            Username
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="auth__input"
                                required
                            />
                        </label>
                        <label className="auth__label">
                            Password
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth__input"
                                required
                            />
                        </label>
                        {isSignUp && (
                            <label className="auth__label">
                                Confirm Password
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="auth__input"
                                    required
                                />
                            </label>
                        )}
                        <button type="submit" className="auth__submit-button">{isSignUp ? 'Sign Up' : 'Log In'}</button>
                    </form>
                    <p className="auth__toggle-text">
                        {isSignUp ? 'Already have an account?' : 'Need an account?'}
                    </p>
                    <button className="auth__toggle-button" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? 'Log in' : 'Sign up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Authentication;
