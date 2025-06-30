import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FlightSearch = () => {
  const [flights, setFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFlights = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://localhost:7132/api/FlightRoutes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFlights(res.data);
    } catch (err) {
      console.error('Error fetching flights:', err);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const filteredFlights = flights.filter(f =>
    f.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3>Search Flights</h3>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter source or destination..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredFlights.length === 0 && <p>No flights found.</p>}

      <ul className="list-group">
        {filteredFlights.map((flight) => (
          <li key={flight.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{flight.source} → {flight.destination}</strong><br />
              Duration: {flight.duration}<br />
              Distance: {flight.distance} km
            </div>
            <button
              className="btn btn-primary"
              onClick={() => window.location.href = `/user/book/${flight.id}`}
            >
              View Flights
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightSearch;
