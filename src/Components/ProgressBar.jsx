import React from 'react';
import { Sparkles } from 'lucide-react';

const ProgressBar = ({ progress }) => (
  <div className="relative  bg-white/95 backdrop-blur-md border-b border-rose-100 px-4 py-3 shadow-sm transition-all duration-300">
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between text-sm font-medium text-stone-600 mb-1">
        <span className="flex items-center gap-2 font-serif italic text-rose-600">
          <Sparkles size={14} className="text-rose-400" /> 
          Planning Progress
        </span>
        <span className="text-rose-500 font-bold">{Math.round(progress)}% Ready</span>
      </div>
      <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-rose-300 to-rose-500 h-3 rounded-full transition-all duration-1000 ease-out flex items-center justify-end relative"
          style={{ width: `${progress}%` }}
        >
          
          <div className="absolute inset-0 w-full h-full bg-[url('[https://www.transparenttextures.com/patterns/diagmonds-light.png](https://www.transparenttextures.com/patterns/diagmonds-light.png)')] opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>
      </div>
    </div>
  </div>
);

export default ProgressBar;