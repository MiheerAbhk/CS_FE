import React, { useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/Auth/login', { email, password });
            const token = response.data.token;

            // Decode the JWT to extract userId and role
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            const userId = payload['UserId'];

            login(token, role, userId);
            if (role === 'Admin') {
                navigate('/admin/dashboard');
            }
            else if (role === 'FlightOwner') {
                navigate('/flight-owner/dashboard');
            }
            else if (role === 'Passenger') {
                navigate('/passenger/dashboard');
            }

        } catch (err) {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">SimplyFly Login</h2>
                            <form onSubmit={handleLogin}>
                                {error && <div className="alert alert-danger">{error}</div>}
                }

                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required />
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;