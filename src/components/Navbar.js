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

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">
        SimplyFly
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          {role === 'Admin' && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Dashboard</Link>
            </li>
          )}
          {role === 'FlightOwner' && (
            <li className="nav-item">
              <Link className="nav-link" to="/flightowner">Dashboard</Link>
            </li>
          )}
          {role === 'Passenger' && (
            <li className="nav-item">
              <Link className="nav-link" to="/passenger">Dashboard</Link>
            </li>
          )}
        </ul>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
