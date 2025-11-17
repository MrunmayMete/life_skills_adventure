
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserIcon, LockKeyholeIcon, SparklesIcon } from '../icons/Icons';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple via-brand-pink to-brand-yellow p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-block bg-brand-purple text-white p-3 rounded-full mb-4">
            <SparklesIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-brand-dark">Life Skills Adventure</h1>
          <p className="text-gray-500 mt-2">Your journey to becoming awesome starts here!</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
              What should we call you?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your first name or a cool nickname"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:outline-none transition"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
             <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password (just pretend!)
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockKeyholeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:outline-none transition"
                defaultValue="password123"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-purple text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Let's Go!
          </button>
        </form>
         <p className="text-center text-xs text-gray-400 mt-6">
            No need to sign up! Just enter a name and start your adventure.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
