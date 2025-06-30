import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://localhost:7196/api/Bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>All Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="table table-bordered table-striped mt-3">
            <thead className="table-dark">
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Flight</th>
                <th>Route</th>
                <th>Status</th>
                <th>Seats</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.userEmail}</td>
                  <td>{booking.flightNumber}</td>
                  <td>{booking.source} → {booking.destination}</td>
                  <td>{booking.bookingStatus}</td>
                  <td>{booking.seatNumbers?.join(', ')}</td>
                  <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ViewBookings;
