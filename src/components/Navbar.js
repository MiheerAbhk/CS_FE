import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { role, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!role) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
            <Link className="navbar-brand fw-bold" to="/">
                ✈️ SimplyFly
            </Link>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                    {role === 'Admin' && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/users">Users</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/owners">Flight Owners</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/routes">Routes</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/bookings">Bookings</Link>
                            </li>
                        </>
                    )}
                    {role === 'FlightOwner' && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/flight-owner/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/flight-owner/airline">Airline</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/flight-owner/flights">Flights</Link>
                            </li>
                        </>
                    )}
                    {role === 'Passenger' && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/passenger/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/passenger/search">Search Flights</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/passenger/bookings">My Bookings</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/passenger/payments">Payments</Link>
                            </li>
                        </>
                    )}
                </ul>
                <div className="d-flex align-items-center">
                    <span className="text-white me-3">Welcome, {role}</span>
                    <button className="btn btn-outline-light" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;