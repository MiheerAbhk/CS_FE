import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Admin Dashboard</h2>
        <p>Welcome, Admin! You can manage users, routes, and bookings here.</p>

        <div className="list-group mt-4">
          <Link to="/admin/users" className="list-group-item list-group-item-action">
            View Users
          </Link>
          <Link to="/admin/owners" className="list-group-item list-group-item-action">
            Manage Flight Owners
          </Link>
          <Link to="/admin/routes" className="list-group-item list-group-item-action">
            Manage Flight Routes
          </Link>
          <Link to="/admin/bookings" className="list-group-item list-group-item-action">
            View All Bookings
          </Link>
        </div>
      </div>
      <div className="mt-4">
            <a href="/admin/users" className="btn btn-outline-primary me-2">View Users</a>
            <a href="/admin/owners" className="btn btn-outline-secondary">Manage Flight Owners</a>
            <a href="/admin/routes" className="btn btn-outline-success">Manage Routes</a>
            <a href="/admin/bookings" className="btn btn-outline-danger mt-2">View Bookings</a>
      </div>

    </>
  );
};

export default AdminDashboard;
