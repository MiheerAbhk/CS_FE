import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ManageAirline = () => {
  const [airline, setAirline] = useState(null);
  const [airlineName, setAirlineName] = useState('');
  const [airlineCode, setAirlineCode] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchAirline = async () => {
    try {
      const res = await axios.get('https://localhost:7099/api/Airlines/my-airline', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAirline(res.data);
    } catch (err) {
      setAirline(null); // No airline found
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://localhost:7099/api/Airlines',
        {
          airlineName,
          airlineCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Airline created successfully.');
      fetchAirline();
    } catch (err) {
      setMessage('Failed to create airline.');
    }
  };

  useEffect(() => {
    fetchAirline();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Manage Airline</h2>
        {airline ? (
          <div className="card p-3">
            <h4>Airline Details</h4>
            <p><strong>Name:</strong> {airline.airlineName}</p>
            <p><strong>Code:</strong> {airline.airlineCode}</p>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="mt-4">
            <h4>Create Your Airline</h4>
            <div className="mb-3">
              <label className="form-label">Airline Name</label>
              <input
                type="text"
                className="form-control"
                value={airlineName}
                onChange={(e) => setAirlineName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Airline Code</label>
              <input
                type="text"
                className="form-control"
                value={airlineCode}
                onChange={(e) => setAirlineCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Airline</button>
            {message && <p className="mt-3 text-info">{message}</p>}
          </form>
        )}
      </div>
    </>
  );
};

export default ManageAirline;
