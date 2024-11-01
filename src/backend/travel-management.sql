CREATE DATABASE travelagency;
USE travelagency;

CREATE TABLE Agency (
    AgencyID INT AUTO_INCREMENT PRIMARY KEY,
    AgencyName VARCHAR(255),
    Address VARCHAR(255),
    Phone VARCHAR(15),
    Email VARCHAR(100),
    LicenseNumber VARCHAR(50),
    EstablishedDate DATE
);

CREATE TABLE Customer (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(100),
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    Address VARCHAR(255),
    DateOfBirth DATE,
    Nationality VARCHAR(50)
);

CREATE TABLE Vehicle (
    VehicleID INT AUTO_INCREMENT PRIMARY KEY,
    VehicleType VARCHAR(50),
    LicensePlate VARCHAR(20),
    Capacity INT,
    Model VARCHAR(100),
    MakeYear YEAR,
    InsuranceNumber VARCHAR(50),
    AvailabilityStatus VARCHAR(20)
);

CREATE TABLE Driver (
    DriverID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    Phone VARCHAR(15),
    LicenseNumber VARCHAR(50),
    ExperienceYears INT,
    AssignedVehicleID INT,
    AvailabilityStatus BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (AssignedVehicleID) REFERENCES Vehicle(VehicleID)
);

CREATE TABLE Booking (
    BookingID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    AgencyID INT,
    VehicleID INT,
    DriverID INT,
    TripDate DATE,
    BookingDate DATE,
    StartLocation VARCHAR(255),
    EndLocation VARCHAR(255),
    TotalCost DECIMAL(10,2),
    PaymentStatus VARCHAR(20),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (AgencyID) REFERENCES Agency(AgencyID),
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID),
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID)
);

CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    BookingID INT,
    Amt DECIMAL(10,2),
    PaymentStatus VARCHAR(20),
    PaymentMethod VARCHAR(50),
    Dues DECIMAL(10,2),
    PaymentDate DATE,
    FOREIGN KEY (BookingID) REFERENCES Booking(BookingID)
);

SELECT * FROM Customer;

-- Insert 3 vehicles (mini, sedan, and SUV)
INSERT INTO Vehicle (VehicleType, LicensePlate, Capacity, Model, MakeYear, InsuranceNumber, AvailabilityStatus)
VALUES 
('Mini', 'ABC1234', 4, 'Toyota Prius', 2020, 'INS12345MINI', 'Available'),
('Sedan', 'XYZ5678', 5, 'Honda Accord', 2019, 'INS67890SEDAN', 'Available'),
('SUV', 'LMN9101', 7, 'Ford Explorer', 2021, 'INS11223SUV', 'Available');

SELECT * FROM Vehicle;
 delete from Vehicle ;

-- Insert 3 drivers, each assigned to one of the vehicles inserted above
INSERT INTO Driver (FirstName, LastName, Phone, LicenseNumber, ExperienceYears, AssignedVehicleID, AvailabilityStatus)
VALUES 
('John', 'Doe', '555-1234', 'DRV1234', 5, 1, TRUE), -- Assigned to Mini (VehicleID = 1)
('Jane', 'Smith', '555-5678', 'DRV5678', 3, 2, TRUE), -- Assigned to Sedan (VehicleID = 2)
('Bob', 'Johnson', '555-9101', 'DRV9101', 7, 3, TRUE); -- Assigned to SUV (VehicleID = 3)

SELECT * FROM Driver;

SELECT v.VehicleID, v.Model, v.LicensePlate, d.FirstName AS driverFirstName, d.LastName AS driverLastName, v.Capacity
FROM Vehicle v
JOIN Driver d ON v.VehicleID = d.AssignedVehicleID
WHERE v.AvailabilityStatus = 'Available' 
AND v.VehicleType = 'Sedan';  -- Replace 'Sedan' with an actual value to test

 -- UPDATE Vehicle SET AvailabilityStatus = 'Available' WHERE VehicleID = 2;
 

 
 
