// export default App;

// import React from 'react';
// import { BrowserRouter, Route,Routes } from 'react-router-dom';

// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Home from './pages/home'
// import Booking from './pages/Booking'
// import Payment from './pages/Payment'
// // const App = () => {
// //     return (
// //         <div className='App'>
            
// //                 <Login/>
// //                 <Dashboard />
            
// //         </div>
// //     );
// // };

// function App() {
//   return (
//       <BrowserRouter>
//           <Routes>
//               <Route path="/" element={<Login />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/home" element={<Home />} />
//               <Route path="/booking" element={<Booking />} />
//               <Route path="/payment" element={<Payment />} />
//           </Routes>
//       </BrowserRouter>
//   );
// }
// export default App;



// import React from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Home from './pages/home';
// import Booking from './pages/Booking';
// import ConfirmBooking from './pages/ConfirmBooking'; // New ConfirmBooking page
// import AvailableCars from './pages/AvailableCars';   // Assuming AvailableCars page exists
// import Payment from './pages/Payment';

// function App() {
//   return (
//       <BrowserRouter>
//           <Routes>
//               <Route path="/" element={<Login />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/home" element={<Home />} />
//               <Route path="/booking" element={<Booking />} />
//               <Route path="/confirm-booking" element={<ConfirmBooking />} /> {/* New route for confirm booking */}
//               <Route path="/available-cars" element={<AvailableCars />} />   {/* Available cars route */}
//               <Route path="/payment" element={<Payment />} />
//           </Routes>
//       </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/home';
import Booking from './pages/Booking';
import ConfirmBooking from './pages/ConfirmBooking';
import AvailableCars from './pages/AvailableCars';
import Payment from './pages/Payment';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for login page */}
        <Route path="/" element={<Login />} />
        
        {/* Route for dashboard after login */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Route for home page */}
        <Route path="/home" element={<Home />} />

        {/* Route for booking page */}
        <Route path="/booking" element={<Booking />} />

        {/* Route for confirming booking */}
        <Route path="/confirm-booking" element={<ConfirmBooking />} />

        {/* Route for available cars page */}
        <Route path="/available-cars" element={<AvailableCars />} />

        {/* Route for payment page */}
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
