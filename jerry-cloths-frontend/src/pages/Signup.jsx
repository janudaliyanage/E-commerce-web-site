import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', formData.email);
        alert('Account created successfully!');
        navigate('/');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-12">
        <img src="/assets/logo.png" alt="Jerry Cloths" className="h-12 object-contain" />
      </div>

      {/* Sign Up Title */}
      <div className="w-full max-w-md mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-gray-600">Sign up to start shopping</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-md mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSignup} className="w-full max-w-md space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black transition"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black transition"
          />
        </div>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black transition"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black transition"
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black transition"
        />

        {/* Address */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black transition"
        />

        {/* City & Zip Code */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black transition"
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Zip code"
            value={formData.zipCode}
            onChange={handleChange}
            className="px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black transition"
          />
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
          {!loading && <ArrowRight size={20} className="ml-2" />}
        </button>
      </form>

      {/* Divider */}
      <div className="w-full max-w-md flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Login Link */}
      <p className="text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-black font-bold hover:underline">
          Sign in
        </Link>
      </p>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>By continuing, you agree to our Terms of Service</p>
      </div>
    </div>
  );
};

export default Signup;