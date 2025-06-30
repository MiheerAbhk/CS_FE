import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const ManageFlightOwners = () => {
  const [owners, setOwners] = useState([]);

  const fetchFlightOwners = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://localhost:7196/api/Users/FlightOwners', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOwners(res.data);
    } catch (err) {
      console.error('Error fetching flight owners:', err);
    }
  };

  useEffect(() => {
    fetchFlightOwners();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Manage Flight Owners</h2>
        {owners.length === 0 ? (
          <p>No flight owners found.</p>
        ) : (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Owner ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {owners.map(owner => (
                <tr key={owner.id}>
                  <td>{owner.id}</td>
                  <td>{owner.fullName}</td>
                  <td>{owner.email}</td>
                  <td>{owner.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ManageFlightOwners;
