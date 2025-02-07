import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUser, FaLock } from 'react-icons/fa';
import { useThemeContext } from '../ThemeContext';

// Schema for form validation
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const { darkMode } = useThemeContext();

  const onSubmit = async (data) => {
    toast.loading('Processing your request...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      toast.dismiss();

      if (response.ok) {
        toast.success('Signup successful!');
        navigate('/login');
      } else {
        toast.error(result.message || 'Signup failed!');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className={`p-8 rounded-lg shadow-lg w-96 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-black'}`}>Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                {...register('name')}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                placeholder="Enter your name"
              />
              <FaUser className="absolute right-3 top-3 text-gray-400" />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

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