import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label>
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {isSignUp && (
                    <>
                        <label>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </>
                )}
                <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
            </form>
            <p>
                {isSignUp ? 'Already have an account?' : 'Need an account?'}
            </p>
            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Log in' : 'Sign up'}
            </button>
        </div>
    );
};

export default Authentication;
