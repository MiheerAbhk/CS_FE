import React from 'react';
import Navbar from '../components/Navbar';

const FlightOwnerDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Flight Owner Dashboard</h2>
        <p>Welcome, Flight Owner! You can manage your airline, flights, and view bookings here.</p>

        <div className="mt-4">
          <a href="/flight-owner/airline" className="btn btn-primary me-3">Manage Airline</a>
          <a href="/flight-owner/flights" className="btn btn-success me-3">Manage Flights</a>
          <a href="/flight-owner/bookings" className="btn btn-info">View Bookings</a>
        </div>
      </div>
    </>
  );
};

export default FlightOwnerDashboard;
