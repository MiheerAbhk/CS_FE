import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://localhost:7196/api/FlightRoutes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoutes(res.data);
    } catch (err) {
      console.error('Error fetching routes:', err);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Manage Routes</h2>
        {routes.length === 0 ? (
          <p>No flight routes found.</p>
        ) : (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Fare</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(route => (
                <tr key={route.id}>
                  <td>{route.id}</td>
                  <td>{route.source}</td>
                  <td>{route.destination}</td>
                  <td>₹{route.fare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ManageRoutes;
