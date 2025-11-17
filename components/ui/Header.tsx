import React from 'react';
import { Button } from './Button';
import { SparklesIcon, LogOutIcon, FlameIcon } from '../icons/Icons';

interface HeaderProps {
  username: string;
  onLogout: () => void;
  streak: number;
  onStreakClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ username, onLogout, streak, onStreakClick }) => {
  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-brand-purple" />
          <h1 className="text-xl font-bold text-brand-dark hidden sm:block">Life Skills Adventure</h1>
          <button
            onClick={onStreakClick}
            aria-label="Increase your streak"
            className="flex items-center space-x-1 bg-orange-100 text-orange-600 font-bold rounded-full px-3 py-1 text-sm animate-fade-in hover:bg-orange-200 hover:scale-105 transition-all transform"
          >
            <FlameIcon className="w-4 h-4" />
            <span>{streak}</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-700">Welcome, {username}!</span>
          <Button onClick={onLogout} variant="secondary" size="sm" className="flex items-center gap-2">
            <LogOutIcon className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};