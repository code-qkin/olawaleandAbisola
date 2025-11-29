import React from 'react';
import { Trash2 } from 'lucide-react';
import Checkbox from './CheckBox';

const TaskItem = ({ item, onToggle, onDelete }) => (
  <li 
    className={`
      group flex items-center gap-3 p-3 rounded-xl transition-all duration-300
      ${item.completed ? 'bg-stone-50/80 text-stone-400' : 'hover:bg-rose-50/40 text-stone-700'}
    `}
  >
    <Checkbox 
      checked={item.completed} 
      onChange={onToggle} 
    />
    <span className={`flex-grow font-medium text-sm md:text-base transition-all duration-300 ${item.completed ? 'line-through decoration-rose-300 opacity-60' : ''}`}>
      {item.text}
    </span>
    <button 
      onClick={onDelete}
      className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-rose-400 transition-all p-2 hover:bg-rose-50 rounded-full"
      aria-label="Delete task"
    >
      <Trash2 size={16} />
    </button>
  </li>
);

export default TaskItem;
