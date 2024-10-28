import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Payment = () => {
    const location = useLocation();
    const { bookingDetails } = location.state || {};
    const [isPaymentComplete, setIsPaymentComplete] = useState(false); // State to track payment status

    if (!bookingDetails || !bookingDetails.selectedCar || !bookingDetails.customer) {
        console.error("Missing booking details, selected car, or customer information.");
        return <div>Error: Missing necessary booking details.</div>;
    }

    const { selectedCar, customer, price, BookingDate, TripDate } = bookingDetails;
    const unsettledDues = 50;
    const totalPrice = (price || 0) + unsettledDues;

    const handlePayment = () => {
        console.log('Processing payment for:', bookingDetails);

        alert('Payment successful! Thank you for your booking.');
        setIsPaymentComplete(true); // Set payment as complete

        // Update car availability after successful payment
        axios.post('http://localhost:5000/api/update-car-availability', { carId: selectedCar.VehicleID })
            .then(response => {
                console.log('Car availability updated:', response.data);
            })
            .catch(error => {
                console.error('Error updating car availability:', error);
            });
    };

    const downloadReceipt = () => {
        const receiptElement = document.getElementById('receipt'); // Get the receipt section by its ID

        html2canvas(receiptElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Adjust image position and size
            pdf.save('Booking_Receipt.pdf');
        });
    };

    return (
        <div className="payment-container">
            <h1>Payment Details</h1>
            <div id="receipt"> {/* Wrap the receipt details in a div with an ID */}
                <p>Customer: {customer.FirstName} {customer.LastName}</p>
                <p>Car: {selectedCar.Model}</p>
                <p>Booking Date: {BookingDate}</p>
                <p>Trip Date: {TripDate}</p>
                <h2>Total: ${totalPrice}</h2>
            </div>
            <button onClick={handlePayment}>Pay Now</button>
            
            {/* Conditionally render Download Receipt button */}
            {isPaymentComplete && (
                <button onClick={downloadReceipt}>Download Receipt</button>
            )}
        </div>
    );
};

export default Payment;
