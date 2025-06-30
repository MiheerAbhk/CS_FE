import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('https://localhost:7132/api/Bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.post('https://localhost:7132/api/Cancellations', {
        bookingId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Booking cancelled.");
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, bookingStatus: 'Cancelled' } : b
      ));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>My Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="row">
          {bookings.map(b => (
            <div key={b.id} className="col-md-6 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{b.flightNumber}</h5>
                  <p className="card-text">
                    <strong>Route:</strong> {b.source} to {b.destination}<br />
                    <strong>Seats:</strong> {b.seatNumbers.join(', ')}<br />
                    <strong>Status:</strong> {b.bookingStatus}<br />
                    <strong>Date:</strong> {new Date(b.bookingDate).toLocaleString()}
                  </p>
                  {b.bookingStatus === 'Confirmed' && (
                    <button className="btn btn-danger" onClick={() => handleCancel(b.id)}>Cancel Booking</button>
                  )}
                  {b.bookingStatus === 'Cancelled' && (
                    <span className="text-danger">Cancelled</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
