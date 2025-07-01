import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get('/Bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await axios.post('/Cancellations', {
                bookingId,
                reason: "Cancelled by passenger"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Booking cancelled successfully.");
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, bookingStatus: 'Cancelled' } : b
            ));
        } catch (err) {
            console.error('Cancellation error:', err);
            alert("Failed to cancel booking. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">My Bookings</h3>

            {bookings.length === 0 ? (
                <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    No bookings found. <a href="/passenger/search" className="alert-link">Search for flights</a> to make your first booking.
                </div>
            ) : (
                <div className="row">
                    {bookings.map(booking => (
                        <div key={booking.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">{booking.flightNumber}</h6>
                                    <span className={`badge ${booking.bookingStatus === 'Confirmed' ? 'bg-success' :
                                            booking.bookingStatus === 'Pending' ? 'bg-warning' :
                                                booking.bookingStatus === 'Cancelled' ? 'bg-danger' : 'bg-secondary'
                                        }`}>
                                        {booking.bookingStatus}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                        <i className="fas fa-route me-2"></i>
                                        <strong>Route:</strong> {booking.source} → {booking.destination}
                                    </p>
                                    <p className="card-text">
                                        <i className="fas fa-chair me-2"></i>
                                        <strong>Seats:</strong> {booking.seatNumbers?.join(', ') || 'N/A'}
                                    </p>
                                    <p className="card-text">
                                        <i className="fas fa-calendar me-2"></i>
                                        <strong>Booked:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                                    </p>

                                    {booking.bookingStatus === 'Confirmed' && (
                                        <button
                                            className="btn btn-outline-danger btn-sm w-100"
                                            onClick={() => handleCancel(booking.id)}
                                        >
                                            <i className="fas fa-times me-2"></i>
                                            Cancel Booking
                                        </button>
                                    )}

                                    {booking.bookingStatus === 'Pending' && (
                                        <div className="alert alert-warning alert-sm mb-0">
                                            <small>
                                                <i className="fas fa-exclamation-triangle me-2"></i>
                                                Payment pending. <a href="/passenger/payments" className="alert-link">Complete payment</a>
                                            </small>
                                        </div>
                                    )}

                                    {booking.bookingStatus === 'Cancelled' && (
                                        <div className="alert alert-danger alert-sm mb-0">
                                            <small>
                                                <i className="fas fa-ban me-2"></i>
                                                This booking has been cancelled
                                            </small>
                                        </div>
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