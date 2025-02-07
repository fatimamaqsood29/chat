import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUser, FaLock } from 'react-icons/fa';
import { useThemeContext } from '../ThemeContext'; // Import the theme context

// Schema for form validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { darkMode } = useThemeContext(); // Get the current theme context

  const onSubmit = (data) => {
    toast.success('Logged in successfully!');
    navigate('/second'); // Navigate to the follow page after login
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className={`p-8 rounded-lg shadow-lg w-96 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-black'}`}>Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="email"
                {...register('email')}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                placeholder="Enter your email"
              />
              <FaUser className="absolute right-3 top-3 text-gray-400" />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="password"
                {...register('password')}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                placeholder="Enter your password"
              />
              <FaLock className="absolute right-3 top-3 text-gray-400" />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-300 text-black hover:bg-gray-400'} transition duration-300`}
          >
            Sign Up
          </button>
        </form>
        <p className={`mt-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Have an account?{' '}
          <button onClick={() => navigate('/login')} className={`text-blue-500 hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}