import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/home.css';
import sedan from '../assets/sedan.jpeg';
import suv from '../assets/suv.jpeg';
import CustomerProfile from './CustomerProfile';
import { ClipboardList } from 'lucide-react'; // Import the bookings icon

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const customerID = location.state?.customerID;

    useEffect(() => {
        if (customerID) {
            console.log(`Customer ID: ${customerID}`);
        } else {
            console.log('Customer ID is missing');
        }
    }, [customerID]);

    const carTypes = [
        { id: 1, name: 'Mini', description: 'Compact and economical for city travel.', price: '$20/day' },
        { id: 2, name: 'Sedan', description: 'Comfortable and spacious for longer trips.', price: '$30/day', image: sedan },
        { id: 3, name: 'SUV', description: 'Perfect for family trips with ample space.', price: '$50/day', image: suv }
    ];

    const handleBookNow = (car) => {
        navigate('/booking', { state: { carType: car.name, customerID } });
    };

    const handleViewBookings = () => {
        navigate('/bookings', { state: { customerID } });
    };

    return (
        <div className="home-container">
            {/* Round View Bookings Icon Button */}
            <button 
                onClick={handleViewBookings}
                className="view-bookings-icon"
                style={{
                    position: 'absolute',
                    top: '60px',
                    left: '10px',
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                }}
            >
                <ClipboardList size={20} color="#666" />
            </button>

            <CustomerProfile customerID={customerID} />
            <h1>Available Car Types</h1>
            <div className="car-list">
                {carTypes.map(car => (
                    <div key={car.id} className="car-item">
                        <h2>{car.name}</h2>
                        {car.image ? (
                            <img src={car.image} alt={car.name} className="car-image" />
                        ) : (
                            <div className="no-image">No Image Available</div>
                        )}
                        <p>{car.description}</p>
                        <p><strong>{car.price}</strong></p>
                        <button className="book-btn" onClick={() => handleBookNow(car)}>Book Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;