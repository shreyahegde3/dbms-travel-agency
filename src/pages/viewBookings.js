// ViewBookings.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get customerID from localStorage or state
    const customerID = localStorage.getItem('customerID') || 
                      (location.state && location.state.customerID);

    useEffect(() => {
        // Redirect if no customerID is found
        if (!customerID) {
            navigate('/login');
            return;
        }

        fetchBookings();
    }, [customerID, navigate]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/booking-history/${customerID}`);
            setBookings(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching booking history');
            setLoading(false);
            console.error('Error:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Booking History</h1>
            {bookings.length === 0 ? (
                <p className="text-center text-gray-600">No booking history found.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.BookingID} 
                             className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Booking #{booking.BookingID}
                                    </h3>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Trip Date:</span> {formatDate(booking.TripDate)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Booking Date:</span> {formatDate(booking.BookingDate)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Route:</span> {booking.StartLocation} to {booking.EndLocation}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Vehicle:</span> {booking.Model} ({booking.LicensePlate})
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Driver:</span> {booking.DriverFirstName} {booking.DriverLastName}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Total Cost:</span> ₹{booking.TotalCost}
                                    </p>
                                    <p className={`font-semibold ${
                                        booking.PaymentStatus === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                        Payment Status: {booking.PaymentStatus}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <button 
                onClick={() => navigate('/home')}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
                Back to Home
            </button>
        </div>
    );
};

export default ViewBookings;