import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
    const location = useLocation();
    const { bookingDetails } = location.state || {}; // Safely access state

    if (!bookingDetails || !bookingDetails.selectedCar || !bookingDetails.customer) {
        console.error("Missing booking details, selected car, or customer information.");
        return <div>Error: Missing necessary booking details.</div>;
    }

    const { selectedCar, customer, price, BookingDate, TripDate } = bookingDetails; // Destructure price too

    const unsettledDues = 50;  // Example value for unsettled dues
    const totalPrice = (price || 0) + unsettledDues;  // Add both distance price and dues

    const handlePayment = () => {
        console.log('Processing payment for:', bookingDetails);

        alert('Payment successful! Thank you for your booking.');

        // Update car availability after successful payment
        axios.post('http://localhost:5000/api/update-car-availability', { carId: selectedCar.VehicleID })
            .then(response => {
                console.log('Car availability updated:', response.data);
            })
            .catch(error => {
                console.error('Error updating car availability:', error);
            });
    };

    return (
        <div className="payment-container">
            <h1>Payment Details</h1>
            <p>Customer: {customer.FirstName} {customer.LastName}</p>
            <p>Car: {selectedCar.Model}</p>
            <p>Booking Date: {BookingDate}</p>
            <p>Trip Date: {TripDate}</p>
            <h2>Total: ${totalPrice}</h2> {/* Display the total price */}
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default Payment;