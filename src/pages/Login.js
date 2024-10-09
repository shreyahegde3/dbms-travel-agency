import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import '../styles/login.css'; // Import the CSS file

const LoginSignUp = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate(); // React Router hook for navigation

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpError, setSignUpError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email: loginEmail, password: loginPassword });
            if (response.data.success) {
                const customerID = response.data.customerID;

                // Log customerID
                console.log(`Logged in customer ID: ${customerID}`);

                // Redirect to home page and pass the customerID
                navigate('/home', { state: { customerID } });
            } else {
                setLoginError('Invalid credentials');
            }
        } catch (err) {
            setLoginError('Login failed. Try again.');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                firstName, lastName, email: signUpEmail, phone, password: signUpPassword
            });

            if (response.data.success) {
                setSuccessMessage('Sign up successful! Please login.');
                setSignUpError('');
                setIsLogin(true);
            } else {
                setSignUpError('Sign up failed. Try again.');
            }
        } catch (err) {
            setSignUpError('Sign up failed. Try again.');
        }
    };

    return (
        <div className="login-signup-container">
            <div className="form-container">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                <button onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
                </button>

                {isLogin ? (
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Login</button>
                        {loginError && <p>{loginError}</p>}
                    </form>
                ) : (
                    <form onSubmit={handleSignUp}>
                        <div>
                            <label>First Name:</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={signUpEmail}
                                onChange={(e) => setSignUpEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                value={signUpPassword}
                                onChange={(e) => setSignUpPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Sign Up</button>
                        {signUpError && <p>{signUpError}</p>}
                        {successMessage && <p>{successMessage}</p>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginSignUp;