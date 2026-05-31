import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', email);
        alert('Login successful!');
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-12">
        <img src="/assets/logo.png" alt="Jerry Cloths" className="h-12 object-contain" />
      </div>

      {/* Sign In Title */}
      <div className="w-full max-w-md mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">Sign in</h1>
        <p className="text-center text-gray-600">Sign in or create an account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-md mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        {/* Email Input */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black transition"
          />
        </div>

        {/* Password Input */}
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black transition"
          />
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? 'Signing in...' : 'Sign in'}
          {!loading && <ArrowRight size={20} className="ml-2" />}
        </button>
      </form>

      {/* Divider */}
      <div className="w-full max-w-md flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-black font-bold hover:underline">
          Create account
        </Link>
      </p>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>By continuing, you agree to our Terms of Service</p>
      </div>
    </div>
  );
};

export default Login;