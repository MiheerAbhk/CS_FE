import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payments = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('https://localhost:7132/api/Bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const pending = res.data.filter(b => b.bookingStatus === 'Pending');
        setBookings(pending);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  const handlePay = async (bookingId) => {
    try {
      await axios.post(`https://localhost:7132/api/Payments`, {
        bookingId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Payment successful. Booking confirmed.");
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Pending Payments</h3>
      {bookings.length === 0 ? (
        <p>No pending bookings found.</p>
      ) : (
        <ul className="list-group">
          {bookings.map(booking => (
            <li key={booking.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{booking.flightNumber}</strong> — {booking.source} to {booking.destination}<br />
                Seats: {booking.seatNumbers.join(", ")}<br />
                Total: ₹{booking.seatNumbers.length * 500}
              </div>
              <button className="btn btn-primary" onClick={() => handlePay(booking.id)}>Pay</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Payments;
