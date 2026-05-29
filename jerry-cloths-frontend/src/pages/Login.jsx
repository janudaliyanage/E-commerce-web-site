import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F2F2F2] py-20 px-4">
      <div className="w-full max-w-[500px] text-center">
        
        <h1 className="text-2xl font-bold tracking-[0.15em] mb-4 uppercase">Login</h1>
        <p className="text-sm text-gray-600 mb-8 tracking-wide">Enter your email and password to login:</p>

        <form className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full bg-[#F2F2F2] border border-gray-300 p-3 text-sm placeholder-gray-500 outline-none focus:border-black transition"
          />
          
          <div className="relative">
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-[#F2F2F2] border border-gray-300 p-3 text-sm placeholder-gray-500 outline-none focus:border-black transition"
            />
            <a href="#" className="absolute right-3 top-3.5 text-xs text-gray-500 hover:text-black transition">
              Forgot your password?
            </a>
          </div>

          <button className="bg-[#121212] text-white text-sm font-bold tracking-[0.15em] py-4 mt-2 hover:opacity-90 transition uppercase">
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="text-gray-500 hover:text-black transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;