import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F2F2F2] py-20 px-4">
      <div className="w-full max-w-[500px] text-center">
        
        <h1 className="text-2xl font-bold tracking-[0.15em] mb-4 uppercase">Sign Up</h1>
        <p className="text-sm text-gray-600 mb-8 tracking-wide">Please fill in the information below:</p>

        <form className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="First name" 
            className="w-full bg-[#F2F2F2] border border-gray-300 p-3 text-sm placeholder-gray-500 outline-none focus:border-black transition"
          />

          <input 
            type="text" 
            placeholder="Last name" 
            className="w-full bg-[#F2F2F2] border border-gray-300 p-3 text-sm placeholder-gray-500 outline-none focus:border-black transition"
          />

          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full bg-[#F2F2F2] border border-gray-300 p-3 text-sm placeholder-gray-500 outline-none focus:border-black transition"
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-[#F2F2F2] border border-gray-300 p-3 text-sm placeholder-gray-500 outline-none focus:border-black transition"
          />

          <button className="bg-[#121212] text-white text-sm font-bold tracking-[0.15em] py-4 mt-2 hover:opacity-90 transition uppercase">
            Create Account
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-gray-500 hover:text-black transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;