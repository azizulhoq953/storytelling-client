import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import '../css/index.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state

        try {
            const response = await axiosInstance.post('/api/auth/login', { email, password });
            const { token } = response.data;

            localStorage.setItem('token', token);

            window.location.href = '/'; 

        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <div>
                {/* <label>Email:</label> */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                {/* <label>Password:</label> */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
