import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ManageFlights = () => {
  const [flights, setFlights] = useState([]);
  const [flightNumber, setFlightNumber] = useState('');
  const [flightRouteId, setFlightRouteId] = useState('');
  const [journeyDate, setJourneyDate] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [routes, setRoutes] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchFlights = async () => {
    try {
      const res = await axios.get('https://localhost:7099/api/Flights', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFlights(res.data);
    } catch (err) {
      console.error('Error fetching flights:', err);
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await axios.get('https://localhost:7099/api/FlightRoutes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoutes(res.data);
    } catch (err) {
      console.error('Error fetching routes:', err);
    }
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://localhost:7099/api/Flights',
        {
          flightNumber,
          flightRouteId: parseInt(flightRouteId),
          totalSeats: parseInt(totalSeats),
          journeyDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Flight added successfully!');
      setFlightNumber('');
      setFlightRouteId('');
      setTotalSeats('');
      setJourneyDate('');
      fetchFlights();
    } catch (err) {
      console.error('Error adding flight:', err);
      setMessage('Error adding flight.');
    }
  };

  useEffect(() => {
    fetchFlights();
    fetchRoutes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Manage Flights</h2>

        <form onSubmit={handleAddFlight} className="mb-4">
          <h4>Add New Flight</h4>
          <div className="mb-2">
            <label>Flight Number</label>
            <input
              className="form-control"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label>Flight Route</label>
            <select
              className="form-select"
              value={flightRouteId}
              onChange={(e) => setFlightRouteId(e.target.value)}
              required
            >
              <option value="">Select Route</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.source} → {route.destination}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label>Total Seats</label>
            <input
              type="number"
              className="form-control"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label>Journey Date</label>
            <input
              type="datetime-local"
              className="form-control"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary">Add Flight</button>
          {message && <p className="mt-2 text-info">{message}</p>}
        </form>

        <h4>Existing Flights</h4>
        {flights.length === 0 ? (
          <p>No flights found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Flight No.</th>
                <th>Route</th>
                <th>Date</th>
                <th>Seats</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td>{flight.flightNumber}</td>
                  <td>
                    {flight.source} → {flight.destination}
                  </td>
                  <td>{new Date(flight.journeyDate).toLocaleString()}</td>
                  <td>{flight.totalSeats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ManageFlights;
