import React from 'react';
import { Leaf, ShoppingCart, Recycle } from 'lucide-react';

export const DecorativeIcons = () => {
  return (
    <>
      {/* Icon di kiri bawah */}
      <div className="absolute bottom-8 left-8 opacity-30">
        <Recycle className="w-12 h-12 text-green-600" />
      </div>
      <div className="absolute bottom-8 left-24 opacity-30">
        <Leaf className="w-12 h-12 text-green-600" />
      </div>
      
      {/* Icon di tengah bawah */}
      <div className="absolute bottom-32 left-1/4 opacity-20">
        <Leaf className="w-10 h-10 text-green-500" />
      </div>
      <div className="absolute bottom-32 left-1/3 opacity-20">
        <ShoppingCart className="w-10 h-10 text-gray-400" />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-orange-400 rounded-full opacity-40 blur-2xl"></div>
      <div className="absolute top-40 right-40 w-24 h-24 bg-purple-500 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-green-400 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-1/4 left-10 w-40 h-40 bg-purple-600 rounded-full opacity-20 blur-2xl"></div>
      
      {/* Lines decoration */}
      <svg className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="80%" y1="0" x2="100%" y2="50%" stroke="#9CA3AF" strokeWidth="1"/>
        <line x1="90%" y1="20%" x2="100%" y2="60%" stroke="#9CA3AF" strokeWidth="1"/>
        <circle cx="85%" cy="15%" r="8" fill="none" stroke="#D1D5DB" strokeWidth="1"/>
        <circle cx="95%" cy="45%" r="6" fill="none" stroke="#D1D5DB" strokeWidth="1"/>
      </svg>
    </>
  );
};