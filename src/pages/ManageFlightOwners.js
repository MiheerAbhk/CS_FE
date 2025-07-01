import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ManageFlightOwners = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFlightOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/Users/FlightOwners', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOwners(res.data);
        } catch (err) {
            console.error('Error fetching flight owners:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlightOwners();
    }, []);

    const filteredOwners = owners.filter(owner =>
        owner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <h2 className="mb-4">Manage Flight Owners</h2>

            <div className="row mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search flight owners by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <span className="badge bg-primary fs-6">
                        Total Flight Owners: {owners.length}
                    </span>
                </div>
            </div>

            {filteredOwners.length === 0 ? (
                <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    {owners.length === 0 ? 'No flight owners found.' : 'No flight owners match your search criteria.'}
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Owner ID</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOwners.map(owner => (
                                        <tr key={owner.id}>
                                            <td>
                                                <span className="badge bg-secondary">{owner.id}</span>
                                            </td>
                                            <td>
                                                <strong>{owner.fullName}</strong>
                                            </td>
                                            <td>
                                                <i className="fas fa-envelope me-2 text-muted"></i>
                                                {owner.email}
                                            </td>
                                            <td>
                                                <i className="fas fa-phone me-2 text-muted"></i>
                                                {owner.phoneNumber || 'N/A'}
                                            </td>
                                            <td>
                                                <span className="badge bg-success">Active</span>
                                            </td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <button className="btn btn-sm btn-outline-primary" title="View Details">
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-warning" title="Edit">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" title="Suspend">
                                                        <i className="fas fa-ban"></i>
                                                    </button>
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

export default ManageFlightOwners;