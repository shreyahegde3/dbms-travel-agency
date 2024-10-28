require('dotenv').config();
// Import required modules
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');

// Initialize the express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON data from requests

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost', // Your MySQL host
    user: 'root',      // Your MySQL username
    password: 'Padigeri@1234',  // Your MySQL password
    database: 'travelagency' // Your MySQL database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

// // POST route for Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Fetch the hashed password from the database
    const query = 'SELECT CustomerID, Password FROM Customer WHERE email = ?';
    db.query(query, [email], async (err, result) => {
        if (err) {
            return res.status(500).send('Error retrieving customer data');
        }

        if (result.length > 0) {
            const hashedPassword = result[0].Password;
            const customerID = result[0].CustomerID;

            // Compare the provided password with the hashed password
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (passwordMatch) {
                // If passwords match, log the customer in
                res.json({ success: true, customerID });
            } else {
                // If passwords don't match, return an error
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

// POST route for Sign-Up
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if email already exists
    const emailCheckQuery = 'SELECT * FROM Customer WHERE Email = ?';
    db.query(emailCheckQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ success: false, message: 'Error checking email' });
        }
        if (results.length > 0) {
            // If email exists, return a message indicating that
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        try {
            // Hash the password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new customer into the Customer table
            const query = `
                INSERT INTO Customer (FirstName, LastName, Email, Phone, Password)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(query, [firstName, lastName, email, phone, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting customer:', err);
                    return res.status(500).json({ success: false, message: 'Sign up failed' });
                }

                // If insertion is successful, return success message
                return res.status(201).json({ success: true, message: 'Sign up successful' });
            });
        } catch (error) {
            // Handle any errors that occur during password hashing
            console.error('Error hashing password:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
});

// Fetch available cars based on trip details
app.post('/api/available-cars', (req, res) => {
    const { startLocation, endLocation, vehicleType } = req.body;

    // Log the incoming request to see if the data is being received correctly
    console.log('Received request with data:', req.body);

    // Validate the request data
    if (!startLocation || !endLocation || !vehicleType) {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields: startLocation, endLocation, or vehicleType' });
    }

    // Define the SQL query to fetch available cars based on vehicle type
    const query = `
        SELECT v.VehicleID, v.Model, v.LicensePlate, d.FirstName AS driverFirstName, d.LastName AS driverLastName, v.Capacity
        FROM Vehicle v
        JOIN Driver d ON v.VehicleID = d.AssignedVehicleID
        WHERE v.AvailabilityStatus = 'Available' 
        AND v.VehicleType = ?  -- Filter by the selected VehicleType
    `;

    // Log the query and the values being passed to the database
    console.log('Executing query with vehicleType:', vehicleType);

    // Execute the query and handle the results or any errors
    db.query(query, [vehicleType], (err, results) => {
        if (err) {
            console.error('Error fetching available cars from the database:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // If no cars are available, return an appropriate message
        if (results.length === 0) {
            return res.status(404).json({ message: 'No available cars found for the selected vehicle type' });
        }

        // Respond with the results if successful
        res.json(results);
    });
});

app.post('/api/update-car-availability', (req, res) => {
    const { carId } = req.body;

    // Mark the car unavailable on the trip date and available the next day
    const query = `UPDATE Vehicle SET AvailabilityStatus = 'Unavailable' WHERE VehicleID = ?`;
    db.query(query, [carId], (err, result) => {
        if (err) {
            console.error('Error updating car availability:', err);
            res.status(500).send('Error updating car availability');
        } else {
            // Optionally schedule the car to be available again the next day (handled via cron job or external system)
            res.json({ success: true });
        }
    });
});

app.get('/api/customer-details/:customerID', (req, res) => {
    const customerID = req.params.customerID;

    const query = 'SELECT * FROM Customer WHERE CustomerID = ?';
    
    db.query(query, [customerID], (err, result) => {
        console.log('Database query result:', result); // Add this to check what the query returns
        if (err) {
            console.error('Error fetching customer details:', err);
            return res.status(500).json({ error: 'Error fetching customer details' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        console.log('Customer details fetched:', result);
        res.json(result[0]);
    });    
});

app.post('/api/confirm-booking', async (req, res) => {
    const { tripDate, bookingDate, startLocation, endLocation, selectedCar, customer, price } = req.body;

    if (!price) {
        return res.status(400).json({ success: false, message: 'Price is required' });
    }

    try {
        // Wrap the db.query inside a promise
        const insertBooking = () => {
            return new Promise((resolve, reject) => {
                const query = `
                    INSERT INTO Booking (CustomerID, VehicleID, DriverID, TripDate, BookingDate, StartLocation, EndLocation, TotalCost, PaymentStatus)
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
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        const bookingResult = await insertBooking();

        // Fetch the newly created booking details
        const getBookingDetails = () => {
            return new Promise((resolve, reject) => {
                const bookingDetailsQuery = `
                    SELECT 
                        b.BookingID, b.TripDate, b.BookingDate, b.StartLocation, b.EndLocation, b.TotalCost, b.PaymentStatus,
                        v.VehicleType, v.LicensePlate, v.Model, 
                        d.FirstName AS DriverFirstName, d.LastName AS DriverLastName, d.Phone AS DriverPhone,
                        c.FirstName AS CustomerFirstName, c.LastName AS CustomerLastName, c.Email AS CustomerEmail, c.Phone AS CustomerPhone
                    FROM Booking b
                    JOIN Vehicle v ON b.VehicleID = v.VehicleID
                    JOIN Driver d ON b.DriverID = d.DriverID
                    JOIN Customer c ON b.CustomerID = c.CustomerID
                    WHERE b.BookingID = ?
                `;
                db.query(bookingDetailsQuery, [bookingResult.insertId], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
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

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

