import React from 'react';
import { useNavigate } from 'react-router-dom';
import sedan from '../assets/sedan.jpeg';
import suv from '../assets/suv.jpeg';

const CarList = ({ customerID }) => {
    const navigate = useNavigate();

    const carTypes = [
        { id: 1, name: 'Mini', description: 'Compact and economical for city travel.', price: '$20/day' },
        { id: 2, name: 'Sedan', description: 'Comfortable and spacious for longer trips.', price: '$30/day', image: sedan },
        { id: 3, name: 'SUV', description: 'Perfect for family trips with ample space.', price: '$50/day', image: suv }
    ];

    const handleBookNow = (car) => {
        navigate('/booking', { state: { carType: car.name, customerID } });
    };

    return (
        <div className="home-container">
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

export default CarList;