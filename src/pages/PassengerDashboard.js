import React from 'react';
import { Link } from 'react-router-dom';

const PassengerDashboard = () => {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Passenger Dashboard</h2>
                    <p className="lead">Welcome! Book your flights and manage your travel.</p>
                </div>
            </div>

            <div className="row g-4 mt-3">
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <div className="mb-3">
                                <i className="fas fa-search fa-3x text-primary"></i>
                            </div>
                            <h5 className="card-title">Search Flights</h5>
                            <p className="card-text">Find and book flights to your destination</p>
                            <Link to="/passenger/search" className="btn btn-primary">
                                Search Flights
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <div className="mb-3">
                                <i className="fas fa-list fa-3x text-success"></i>
                            </div>
                            <h5 className="card-title">My Bookings</h5>
                            <p className="card-text">View and manage your flight bookings</p>
                            <Link to="/passenger/bookings" className="btn btn-success">
                                My Bookings
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <div className="mb-3">
                                <i className="fas fa-credit-card fa-3x text-warning"></i>
                            </div>
                            <h5 className="card-title">Payments</h5>
                            <p className="card-text">Complete pending payments</p>
                            <Link to="/passenger/payments" className="btn btn-warning">
                                View Payments
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerDashboard;