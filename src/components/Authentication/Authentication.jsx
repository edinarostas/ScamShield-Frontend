import React, { useState } from 'react';

const Authentication = ({ isSignUp, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSignUp) {
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            const { username, password } = event.target.value;
            console.log('Signing up:', { username, password });
            try {
                const response = await axios.post("http://localhost:8080/signup", {
                    username,
                    password
                });
                sessionStorage.setItem("authToken", response.data.token);
                setIsLoggedIn(true);
                console.log("got a successful response from the server and got the token")
            } catch (error) {
                console.log("Error happened while signing up: ", error)
            }
        } else {
            try {
                const response = await axios.post("http://localhost:8080/login", {
                    username,
                    password
                });
                sessionStorage.setItem("authToken", response.data.token);
                console.log('Logging in:', { username, password });
                onLoginSuccess(); // Call this function after successful login
                console.log("Login successful");
            } catch (error) {
                console.log("Error happened while logging in: ", error);
            }
            console.log('Logging in:', { username, password });
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
        </div>
    );
};

export default Authentication;
