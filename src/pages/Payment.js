// Payment.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/payment.css'

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails } = location.state || {};
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    if (!bookingDetails || !bookingDetails.selectedCar || !bookingDetails.customer) {
        console.error("Missing booking details, selected car, or customer information.");
        return <div>Error: Missing necessary booking details.</div>;
    }

    const { selectedCar, customer, price, BookingDate, TripDate, bookingID } = bookingDetails;
    const unsettledDues = 50;
    const totalPrice = (price || 0) + unsettledDues;

    const handlePayment = async () => {
        try {
            // Create payment record
            const paymentData = {
                bookingID: bookingID,
                amount: totalPrice,
                paymentMethod: paymentMethod,
                dues: unsettledDues
            };

            const response = await axios.post('http://localhost:5000/api/process-payment', paymentData);

            if (response.data.success) {
                // Update car availability
                await axios.post('http://localhost:5000/api/update-car-availability', { 
                    carId: selectedCar.VehicleID 
                });

                setIsPaymentComplete(true);
                alert('Payment successful! Thank you for your booking.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
        }
    };

    const downloadReceipt = () => {
        const receiptElement = document.getElementById('receipt');

        html2canvas(receiptElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            pdf.save('Booking_Receipt.pdf');
        });
    };

    return (
        <div className="payment-container">
            <h1>Payment Details</h1>
            <div id="receipt">
                <p>Customer: {customer.FirstName} {customer.LastName}</p>
                <p>Car: {selectedCar.Model}</p>
                <p>Booking Date: {BookingDate}</p>
                <p>Trip Date: {TripDate}</p>
                <p>Base Price: ${price}</p>
                <p>Additional Dues: ${unsettledDues}</p>
                <h2>Total: ${totalPrice}</h2>
            </div>

            <div className="payment-method-selection">
                <label>
                    Payment Method:
                    <select 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="upi">UPI</option>
                        <option value="net_banking">Net Banking</option>
                    </select>
                </label>
            </div>

            <button onClick={handlePayment}>Pay Now</button>
            
            {isPaymentComplete && (
                <button onClick={downloadReceipt}>Download Receipt</button>
            )}
        </div>
    );
};

export default Payment;