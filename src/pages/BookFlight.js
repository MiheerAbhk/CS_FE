import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookFlight = () => {
  const { routeId } = useParams();
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get('https://localhost:7132/api/Flights', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const routeFlights = res.data.filter(f => f.flightRouteId === parseInt(routeId));
        setFlights(routeFlights);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFlights();
  }, [routeId]);

  const handleViewSeats = async (flightId) => {
    try {
      const res = await axios.get(`https://localhost:7132/api/Bookings/flight/${flightId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedFlight(flights.find(f => f.id === flightId));
      setAvailableSeats(res.data.seats);
      setSelectedSeats([]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    if (!selectedFlight || selectedSeats.length === 0) {
      alert("Please select a flight and at least one seat.");
      return;
    }

    try {
      await axios.post('https://localhost:7132/api/Bookings', {
        flightId: selectedFlight.id,
        seatNumbers: selectedSeats
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Booking successful! Proceed to payment.");
      setSelectedFlight(null);
      setSelectedSeats([]);
    } catch (err) {
      console.error(err);
      alert("Booking failed.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Available Flights</h3>
      {flights.length === 0 && <p>No flights found for this route.</p>}

      <ul className="list-group mb-4">
        {flights.map(flight => (
          <li key={flight.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{flight.flightNumber}</strong><br />
              Airline: {flight.airlineName} | Price: ₹{flight.price}
            </div>
            <button className="btn btn-outline-primary" onClick={() => handleViewSeats(flight.id)}>
              View Seats
            </button>
          </li>
        ))}
      </ul>

      {selectedFlight && (
        <div>
          <h4>Choose Seats for {selectedFlight.flightNumber}</h4>
          <div className="d-flex flex-wrap">
            {availableSeats.map(seat => (
              <div
                key={seat.seatNumber}
                className={`m-2 p-2 border rounded text-center ${seat.isBooked ? 'bg-danger text-white' : selectedSeats.includes(seat.seatNumber) ? 'bg-success text-white' : 'bg-light'}`}
                style={{ width: 50, cursor: seat.isBooked ? 'not-allowed' : 'pointer' }}
                onClick={() => !seat.isBooked && toggleSeatSelection(seat.seatNumber)}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>

          <button className="btn btn-success mt-3" onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default BookFlight;
