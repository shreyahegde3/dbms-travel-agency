
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');

// Initialize the express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Padigeri@1234',
    database: 'travelagency'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT CustomerID, Password FROM Customer WHERE email = ?';
    db.query(query, [email], async (err, result) => {
        if (err) {
            return res.status(500).send('Error retrieving customer data');
        }

        if (result.length > 0) {
            const hashedPassword = result[0].Password;
            const customerID = result[0].CustomerID;

            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (passwordMatch) {
                res.json({ success: true, customerID });
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

// Sign-up route
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    const emailCheckQuery = 'SELECT * FROM Customer WHERE Email = ?';
    db.query(emailCheckQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ success: false, message: 'Error checking email' });
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `
                INSERT INTO Customer (FirstName, LastName, Email, Phone, Password)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(query, [firstName, lastName, email, phone, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting customer:', err);
                    return res.status(500).json({ success: false, message: 'Sign up failed' });
                }
                return res.status(201).json({ success: true, message: 'Sign up successful' });
            });
        } catch (error) {
            console.error('Error hashing password:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
});

// Update customer route
app.put('/api/update-customer/:customerID', (req, res) => {
    const customerID = req.params.customerID;
    const { FirstName, LastName, Email, Phone } = req.body;

    const query = `
        UPDATE Customer 
        SET FirstName = ?, LastName = ?, Email = ?, Phone = ?
        WHERE CustomerID = ?
    `;

    db.query(query, [FirstName, LastName, Email, Phone, customerID], (err, result) => {
        if (err) {
            console.error('Error updating customer:', err);
            return res.status(500).json({ error: 'Error updating customer details' });
        }
        res.json({ success: true, message: 'Customer details updated successfully' });
    });
});

// Delete customer route
app.delete('/api/delete-customer/:customerID', (req, res) => {
    const customerID = req.params.customerID;

    const deleteBookingsQuery = 'DELETE FROM Booking WHERE CustomerID = ?';
    db.query(deleteBookingsQuery, [customerID], (err) => {
        if (err) {
            console.error('Error deleting customer bookings:', err);
            return res.status(500).json({ error: 'Error deleting customer account' });
        }

        const deleteCustomerQuery = 'DELETE FROM Customer WHERE CustomerID = ?';
        db.query(deleteCustomerQuery, [customerID], (err) => {
            if (err) {
                console.error('Error deleting customer:', err);
                return res.status(500).json({ error: 'Error deleting customer account' });
            }
            res.json({ success: true, message: 'Customer account deleted successfully' });
        });
    });
});

// Available cars route
app.post('/api/available-cars', (req, res) => {
    const { startLocation, endLocation, vehicleType } = req.body;

    if (!startLocation || !endLocation || !vehicleType) {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        SELECT v.VehicleID, v.Model, v.LicensePlate, d.FirstName AS driverFirstName, 
               d.LastName AS driverLastName, v.Capacity, d.DriverID
        FROM Vehicle v
        JOIN Driver d ON v.VehicleID = d.AssignedVehicleID
        WHERE v.AvailabilityStatus = 'Available' 
        AND v.VehicleType = ?
    `;

    db.query(query, [vehicleType], (err, results) => {
        if (err) {
            console.error('Error fetching available cars:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No available cars found' });
        }

        res.json(results);
    });
});

// Update car availability route
app.post('/api/update-car-availability', (req, res) => {
    const { carId } = req.body;

    const query = `UPDATE Vehicle SET AvailabilityStatus = 'Unavailable' WHERE VehicleID = ?`;
    db.query(query, [carId], (err, result) => {
        if (err) {
            console.error('Error updating car availability:', err);
            res.status(500).send('Error updating car availability');
        } else {
            res.json({ success: true });
        }
    });
});

// Get customer details route
app.get('/api/customer-details/:customerID', (req, res) => {
    const customerID = req.params.customerID;

    const query = 'SELECT * FROM Customer WHERE CustomerID = ?';
    
    db.query(query, [customerID], (err, result) => {
        if (err) {
            console.error('Error fetching customer details:', err);
            return res.status(500).json({ error: 'Error fetching customer details' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(result[0]);
    });    
});

// Confirm booking route
app.post('/api/confirm-booking', async (req, res) => {
    const { tripDate, bookingDate, startLocation, endLocation, selectedCar, customer, price } = req.body;

    if (!price) {
        return res.status(400).json({ success: false, message: 'Price is required' });
    }

    try {
        const insertBooking = () => {
            return new Promise((resolve, reject) => {
                const query = `
                    INSERT INTO Booking (CustomerID, VehicleID, DriverID, TripDate, BookingDate, 
                                      StartLocation, EndLocation, TotalCost, PaymentStatus)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
                `;
                db.query(query, [
                    customer.CustomerID, 
                    selectedCar.VehicleID, 
                    selectedCar.DriverID, 
                    tripDate, 
                    bookingDate, 
                    startLocation, 
                    endLocation, 
                    price
                ], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        };

        const bookingResult = await insertBooking();

        const getBookingDetails = () => {
            return new Promise((resolve, reject) => {
                const query = `
                    SELECT 
                        b.BookingID, b.TripDate, b.BookingDate, b.StartLocation, b.EndLocation, 
                        b.TotalCost, b.PaymentStatus,
                        v.VehicleType, v.LicensePlate, v.Model, 
                        d.FirstName AS DriverFirstName, d.LastName AS DriverLastName, 
                        d.Phone AS DriverPhone,
                        c.FirstName AS CustomerFirstName, c.LastName AS CustomerLastName, 
                        c.Email AS CustomerEmail, c.Phone AS CustomerPhone
                    FROM Booking b
                    JOIN Vehicle v ON b.VehicleID = v.VehicleID
                    JOIN Driver d ON b.DriverID = d.DriverID
                    JOIN Customer c ON b.CustomerID = c.CustomerID
                    WHERE b.BookingID = ?
                `;
                db.query(query, [bookingResult.insertId], (err, result) => {
                    if (err) reject(err);
                    else resolve(result[0]);
                });
            });
        };

        const bookingDetails = await getBookingDetails();

        res.status(200).json({
            success: true,
            message: 'Booking confirmed',
            bookingID: bookingResult.insertId,
            vehicleDetails: bookingDetails
        });
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).send('Server error');
    }
});

// New route to process payments
app.post('/api/process-payment', async (req, res) => {
    const { bookingID, amount, paymentMethod, dues } = req.body;
    
    try {
        // Begin transaction
        await new Promise((resolve, reject) => {
            db.beginTransaction(err => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Insert payment record
        const insertPaymentQuery = `
            INSERT INTO Payment (BookingID, Amt, PaymentStatus, PaymentMethod, Dues, PaymentDate)
            VALUES (?, ?, 'Completed', ?, ?, CURRENT_DATE)
        `;
        
        const paymentResult = await new Promise((resolve, reject) => {
            db.query(insertPaymentQuery, [bookingID, amount, paymentMethod, dues], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Update booking payment status
        const updateBookingQuery = `
            UPDATE Booking 
            SET PaymentStatus = 'Completed'
            WHERE BookingID = ?
        `;
        
        await new Promise((resolve, reject) => {
            db.query(updateBookingQuery, [bookingID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Commit transaction
        await new Promise((resolve, reject) => {
            db.commit(err => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ 
            success: true, 
            message: 'Payment processed successfully',
            paymentID: paymentResult.insertId 
        });

    } catch (error) {
        // Rollback transaction on error
        await new Promise(resolve => {
            db.rollback(() => resolve());
        });
        
        console.error('Error processing payment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Payment processing failed' 
        });
    }
});

// Get booking history route
app.get('/api/booking-history/:customerID', (req, res) => {
    const customerID = req.params.customerID;

    const query = `
        SELECT b.*, v.Model, v.LicensePlate, 
               d.FirstName AS DriverFirstName, d.LastName AS DriverLastName,
               p.PaymentStatus AS PaymentStatus, p.PaymentMethod
        FROM Booking b
        LEFT JOIN Vehicle v ON b.VehicleID = v.VehicleID
        LEFT JOIN Driver d ON b.DriverID = d.DriverID
        LEFT JOIN Payment p ON b.BookingID = p.BookingID
        WHERE b.CustomerID = ?
        ORDER BY b.BookingDate DESC
    `;

    db.query(query, [customerID], (err, results) => {
        if (err) {
            console.error('Error fetching booking history:', err);
            return res.status(500).json({ error: 'Error fetching booking history' });
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});