import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';

import AdminDashboard from './pages/AdminDashboard';
import ViewUsers from './pages/ViewUsers';
import ManageFlightOwners from './pages/ManageFlightOwners';
import ManageRoutes from './pages/ManageRoutes';
import ViewBookings from './pages/ViewBookings';

import FlightOwnerDashboard from './pages/FlightOwnerDashboard';
import ManageAirline from './pages/ManageAirline';
import ManageFlights from './pages/ManageFlights';

import PassengerDashboard from './pages/PassengerDashboard';
import FlightSearch from './pages/FlightSearch';
import BookFlights from './pages/BookFlight';
import MyBookings from './pages/MyBookings';
import Payment from './pages/Payment';

import RequireAuth from './routes/PrivateRoutes';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<RequireAuth allowedRoles={['Admin']}><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth allowedRoles={['Admin']}><ViewUsers /></RequireAuth>} />
        <Route path="/admin/owners" element={<RequireAuth allowedRoles={['Admin']}><ManageFlightOwners /></RequireAuth>} />
        <Route path="/admin/routes" element={<RequireAuth allowedRoles={['Admin']}><ManageRoutes /></RequireAuth>} />
        <Route path="/admin/bookings" element={<RequireAuth allowedRoles={['Admin']}><ViewBookings /></RequireAuth>} />

        {/* Flight Owner */}
        <Route path="/flight-owner/dashboard" element={<RequireAuth allowedRoles={['FlightOwner']}><FlightOwnerDashboard /></RequireAuth>} />
        <Route path="/flight-owner/airline" element={<RequireAuth allowedRoles={['FlightOwner']}><ManageAirline /></RequireAuth>} />
        <Route path="/flight-owner/flights" element={<RequireAuth allowedRoles={['FlightOwner']}><ManageFlights /></RequireAuth>} />

        {/* Passenger */}
        <Route path="/passenger/dashboard" element={<RequireAuth allowedRoles={['Passenger']}><PassengerDashboard /></RequireAuth>} />
        <Route path="/passenger/search" element={<RequireAuth allowedRoles={['Passenger']}><FlightSearch /></RequireAuth>} />
        <Route path="/passenger/book/:routeId" element={<RequireAuth allowedRoles={['Passenger']}><BookFlights /></RequireAuth>} />
        <Route path="/passenger/bookings" element={<RequireAuth allowedRoles={['Passenger']}><MyBookings /></RequireAuth>} />
        <Route path="/passenger/payments" element={<RequireAuth allowedRoles={['Passenger']}><Payment /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;
