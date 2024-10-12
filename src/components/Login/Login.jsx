import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import videoBg from '../../assets/back.mp4';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/register';
        try {
            const response = await axios.post(`http://localhost:5000${endpoint}`, { username, password });
            if (isLogin) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                setIsRedirecting(true);
                setTimeout(() => {
                    setUsername('');
                    setPassword('');
                    setError('');
                    navigate('/dashboard');
                }, 2000);
            } else {
                setIsLogin(true);
                setError(''); 
                alert('Registration successful! Please log in.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="vid">
            <div className="overlay"></div>
            <video src={videoBg} autoPlay loop muted />
            <div className="login-container">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                {error && <p className="error">{error}</p>}
                {isRedirecting && <p className="redirect-message">Redirecting to Anna AI...</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                            disabled={isRedirecting} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            disabled={isRedirecting} 
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isRedirecting}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} className="toggle-button" disabled={isRedirecting}>
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                </button>
            </div>
        </div>
    );
};

export default Login;
