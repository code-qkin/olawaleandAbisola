import React from 'react';
import { Check } from 'lucide-react';

const Checkbox = ({ checked, onChange }) => (
  <div 
    onClick={onChange}
    className={`
      flex-shrink-0 w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-300 ease-spring
      ${checked ? 'bg-rose-400 border-rose-400 scale-105 shadow-md shadow-rose-200' : 'bg-white border-rose-200 hover:border-rose-300 hover:scale-105'}
    `}
  >
    <Check 
      size={14} 
      className={`text-white transition-transform duration-300 ${checked ? 'scale-100' : 'scale-0'}`} 
      strokeWidth={3}
    />
  </div>
);

export default Checkbox;
