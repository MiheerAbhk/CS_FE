import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/Users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h2 className="mb-4">Registered Users</h2>

            <div className="row mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search users by name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <div className="d-flex gap-2">
                        <span className="badge bg-primary">Total: {users.length}</span>
                        <span className="badge bg-success">
                            Passengers: {users.filter(u => u.role === 'Passenger').length}
                        </span>
                        <span className="badge bg-warning">
                            Flight Owners: {users.filter(u => u.role === 'FlightOwner').length}
                        </span>
                        <span className="badge bg-danger">
                            Admins: {users.filter(u => u.role === 'Admin').length}
                        </span>
                    </div>
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    No users found matching your search criteria.
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>User ID</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <span className="badge bg-secondary">{user.id}</span>
                                            </td>
                                            <td>
                                                <strong>{user.fullName}</strong>
                                            </td>
                                            <td>
                                                <i className="fas fa-envelope me-2 text-muted"></i>
                                                {user.email}
                                            </td>
                                            <td>
                                                <span className={`badge ${user.role === 'Admin' ? 'bg-danger' :
                                                        user.role === 'FlightOwner' ? 'bg-warning' :
                                                            'bg-success'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <i className="fas fa-phone me-2 text-muted"></i>
                                                {user.phoneNumber || 'N/A'}
                                            </td>
                                            <td>
                                                <span className="badge bg-success">Active</span>
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

export default ViewUsers;