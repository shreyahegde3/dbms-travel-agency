import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import '../styles/booking.css';

const Booking = () => {  // Receive customerID as a prop
    const navigate = useNavigate();
    const location = useLocation();
    const { carType, customerID } = location.state || {};  // Get carType and customerID from state

    const [tripDate, setTripDate] = useState('');
    const [bookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [startLocation, setStartLocation] = useState('Bangalore');
    const [endLocation, setEndLocation] = useState('Mysore');
    const [distanceRange, setDistanceRange] = useState('30-40');
    const [price, setPrice] = useState(0);

    // Check if customerID is present and log the result
    useEffect(() => {
        if (customerID) {
            console.log(`Customer ID: ${customerID}`);
        } else {
            console.log('Customer ID is missing');
        }
    }, [customerID]);

    const priceMapping = {
        '30-40': 1500,
        '40-50': 2000,
        '50-60': 2500,
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const calculatedPrice = priceMapping[distanceRange] || 0;

        const bookingData = {
            tripDate,
            bookingDate,
            startLocation,
            endLocation,
            distanceRange,
            price: calculatedPrice,
            carType,
            customerID  // Pass customerID with the booking data
        };

        // Redirect to available cars page, passing booking data
        navigate('/available-cars', { state: { bookingData } });
    };

    return (
        <div className="booking-container">
            <h1>Book a Car</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Trip Date:</label>
                    <input
                        type="date"
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Start Location:</label>
                    <select value={startLocation} onChange={(e) => setStartLocation(e.target.value)} required>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Mysore">Mysore</option>
                        <option value="Hyderabad">Hyderabad</option>
                    </select>
                </div>
                <div>
                    <label>End Location:</label>
                    <select value={endLocation} onChange={(e) => setEndLocation(e.target.value)} required>
                        <option value="Mysore">Mysore</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                    </select>
                </div>
                <div>
                    <label>Distance Range (in km):</label>
                    <select value={distanceRange} onChange={(e) => setDistanceRange(e.target.value)} required>
                        <option value="30-40">30-40 km</option>
                        <option value="40-50">40-50 km</option>
                        <option value="50-60">50-60 km</option>
                    </select>
                </div>
                <button type="submit">Check Available Cars</button>
            </form>
        </div>
    );
};

export default Booking;