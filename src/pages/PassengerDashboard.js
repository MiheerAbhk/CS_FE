import Navbar from '../components/Navbar';

const PassengerDashboard = () => {
  return (
    <>
    <Navbar />
    <div className="container mt-5">
      <h2>Passenger Dashboard</h2>
      <p>Welcome, Passenger! You can search flights, book, and view history.</p>
    </div>
    </>
  );
};

export default PassengerDashboard;
