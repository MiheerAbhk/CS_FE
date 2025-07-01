import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Payment = () => {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPendingBookings = async () => {
            try {
                const res = await axios.get('/Bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const pending = res.data.filter(b => b.bookingStatus === 'Pending');
                setPendingBookings(pending);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingBookings();
    }, [token]);

    const handlePayment = async (bookingId, paymentMethod = 'Credit Card') => {
        try {
            await axios.post('/Payments', {
                bookingId,
                paymentMethod
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Payment successful! Your booking has been confirmed.");
            setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
        } catch (err) {
            console.error('Payment error:', err);
            alert("Payment failed. Please try again.");
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
            <h3 className="mb-4">Pending Payments</h3>

            {pendingBookings.length === 0 ? (
                <div className="alert alert-success">
                    <i className="fas fa-check-circle me-2"></i>
                    No pending payments. All your bookings are up to date!
                </div>
            ) : (
                <div className="row">
                    {pendingBookings.map(booking => (
                        <div key={booking.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-warning text-dark">
                                    <h6 className="mb-0">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        Payment Required
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{booking.flightNumber}</h5>
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
                                        <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                                    </p>

                                    <hr />

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <strong>Total Amount:</strong>
                                        <span className="h5 text-primary mb-0">
                                            ₹{(booking.seatNumbers?.length || 1) * 2500}
                                        </span>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handlePayment(booking.id, 'Credit Card')}
                                        >
                                            <i className="fas fa-credit-card me-2"></i>
                                            Pay with Credit Card
                                        </button>
                                        <button
                                            className="btn btn-outline-success"
                                            onClick={() => handlePayment(booking.id, 'Debit Card')}
                                        >
                                            <i className="fas fa-credit-card me-2"></i>
                                            Pay with Debit Card
                                        </button>
                                        <button
                                            className="btn btn-outline-success"
                                            onClick={() => handlePayment(booking.id, 'UPI')}
                                        >
                                            <i className="fas fa-mobile-alt me-2"></i>
                                            Pay with UPI
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Payment;