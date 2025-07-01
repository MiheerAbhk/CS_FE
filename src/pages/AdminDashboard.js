import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Admin Dashboard</h2>
                    <p className="lead">Welcome, Admin! Manage your flight system from here.</p>
                </div>
            </div>

            <div className="row g-4 mt-3">
                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <div className="mb-3">
                                <i className="fas fa-users fa-3x text-primary"></i>
                            </div>
                            <h5 className="card-title">Users</h5>
                            <p className="card-text">View and manage all registered users</p>
                            <Link to="/admin/users" className="btn btn-primary">
                                View Users
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <div className="mb-3">
                                <i className="fas fa-plane fa-3x text-success"></i>
                            </div>
                            <h5 className="card-title">Flight Owners</h5>
                            <p className="card-text">Manage flight owner accounts</p>
                            <Link to="/admin/owners" className="btn btn-success">
                                Manage Owners
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <div className="mb-3">
                                <i className="fas fa-route fa-3x text-warning"></i>
                            </div>
                            <h5 className="card-title">Routes</h5>
                            <p className="card-text">Manage flight routes and schedules</p>
                            <Link to="/admin/routes" className="btn btn-warning">
                                Manage Routes
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <div className="mb-3">
                                <i className="fas fa-ticket-alt fa-3x text-danger"></i>
                            </div>
                            <h5 className="card-title">Bookings</h5>
                            <p className="card-text">View all flight bookings</p>
                            <Link to="/admin/bookings" className="btn btn-danger">
                                View Bookings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;