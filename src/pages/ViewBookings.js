import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
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

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.destination.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === '' || booking.bookingStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-success';
            case 'Pending': return 'bg-warning';
            case 'Cancelled': return 'bg-danger';
            default: return 'bg-secondary';
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
        <div className="container mt-5">
            <h2 className="mb-4">All Bookings</h2>

            <div className="row mb-4">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by flight, user, or route..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="col-md-5">
                    <div className="d-flex gap-2">
                        <span className="badge bg-primary">Total: {bookings.length}</span>
                        <span className="badge bg-success">
                            Confirmed: {bookings.filter(b => b.bookingStatus === 'Confirmed').length}
                        </span>
                        <span className="badge bg-warning">
                            Pending: {bookings.filter(b => b.bookingStatus === 'Pending').length}
                        </span>
                        <span className="badge bg-danger">
                            Cancelled: {bookings.filter(b => b.bookingStatus === 'Cancelled').length}
                        </span>
                    </div>
                </div>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    {bookings.length === 0 ? 'No bookings found.' : 'No bookings match your search criteria.'}
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>User</th>
                                        <th>Flight</th>
                                        <th>Route</th>
                                        <th>Status</th>
                                        <th>Seats</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td>
                                                <span className="badge bg-secondary">{booking.id}</span>
                                            </td>
                                            <td>
                                                <i className="fas fa-user me-2 text-muted"></i>
                                                {booking.userEmail}
                                            </td>
                                            <td>
                                                <strong>{booking.flightNumber}</strong>
                                            </td>
                                            <td>
                                                <i className="fas fa-route me-2 text-muted"></i>
                                                {booking.source} → {booking.destination}
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(booking.bookingStatus)}`}>
                                                    {booking.bookingStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <i className="fas fa-chair me-2 text-muted"></i>
                                                {booking.seatNumbers?.join(', ') || 'N/A'}
                                            </td>
                                            <td>
                                                <i className="fas fa-calendar me-2 text-muted"></i>
                                                {new Date(booking.bookingDate).toLocaleDateString()}
                                                <br />
                                                <small className="text-muted">
                                                    {new Date(booking.bookingDate).toLocaleTimeString()}
                                                </small>
                                            </td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <button className="btn btn-sm btn-outline-primary" title="View Details">
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-info" title="Contact User">
                                                        <i className="fas fa-envelope"></i>
                                                    </button>
                                                    {booking.bookingStatus === 'Confirmed' && (
                                                        <button className="btn btn-sm btn-outline-danger" title="Cancel Booking">
                                                            <i className="fas fa-ban"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewBookings;