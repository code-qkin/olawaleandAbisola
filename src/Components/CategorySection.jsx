import React, { useState } from 'react';
import { Check, Diamond, ChevronDown, ChevronUp, Trash2, Plus, Store, DollarSign } from 'lucide-react';
import TaskItem from './TaskItem';

const CategorySection = ({ category, onToggleTask, onDeleteTask, onAddTask, onDeleteCategory, onUpdateCategory }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newItemText, setNewItemText] = useState('');
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddTask(category.id, newItemText);
    setNewItemText('');
  };

  const items = category.items || [];
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const isCategoryComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="mb-6 bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-rose-100/50 group/card">
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-5 cursor-pointer flex items-center justify-between transition-colors relative
          ${isCategoryComplete ? 'bg-gradient-to-r from-rose-50/80 to-white' : 'bg-white'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`
            p-2 rounded-full transition-colors duration-500
            ${isCategoryComplete ? 'bg-rose-100 text-rose-500 shadow-sm' : 'bg-stone-50 text-stone-300'}
          `}>
            {isCategoryComplete ? <Check size={20} /> : <Diamond size={20} />}
          </div>
          <div>
            <h3 className={`font-serif text-xl ${isCategoryComplete ? 'text-rose-900' : 'text-stone-800'}`}>
              {category.title}
            </h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">
              {completedCount} / {totalCount} Done
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button
             onClick={(e) => { e.stopPropagation(); onDeleteCategory(category.id); }}
             className="p-2 text-stone-300 hover:text-red-400 opacity-0 group-hover/card:opacity-100 transition-opacity"
             title="Delete Category"
           >
             <Trash2 size={16} />
           </button>
           <div className="text-stone-300">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        
        {/* NEW: Vendor & Payment Details Section */}
        <div className="px-5 pb-4 flex flex-col md:flex-row gap-3">
            {/* Vendor Input */}
            <div className="flex-grow flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-100 focus-within:border-rose-200 focus-within:bg-white transition-all">
                <Store size={14} className="text-stone-400" />
                <input 
                    type="text" 
                    placeholder="Vendor Name (e.g. Flora & Co.)"
                    className="bg-transparent border-none text-sm w-full outline-none text-stone-600 placeholder-stone-400"
                    value={category.vendor || ''}
                    onChange={(e) => onUpdateCategory(category.id, 'vendor', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* Paid Toggle */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onUpdateCategory(category.id, 'paid', !category.paid);
                }}
                className={`
                    flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all
                    ${category.paid 
                        ? 'bg-green-100 text-green-700 border-green-200 shadow-sm' 
                        : 'bg-white text-stone-400 border-stone-200 hover:border-rose-300 hover:text-rose-500'
                    }
                `}
            >
                <DollarSign size={14} />
                {category.paid ? 'Paid in Full' : 'Mark Paid'}
            </button>
        </div>

        {/* Task List */}
        <ul className="px-5 pb-5 space-y-2 border-t border-stone-50 pt-4">
          {items.map((item) => (
            <TaskItem 
              key={item.id}
              item={item}
              onToggle={() => onToggleTask(category.id, item.id)}
              onDelete={() => onDeleteTask(category.id, item.id)}
            />
          ))}

          {/* Add New Item Input */}
          <li className="mt-3 pt-3">
            <form onSubmit={handleAdd} className="flex gap-2 group">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add new task..."
                className="flex-grow bg-transparent border-none px-2 py-2 text-sm focus:ring-0 outline-none text-stone-600 placeholder-stone-400"
              />
              <button 
                type="submit"
                disabled={!newItemText.trim()}
                className="bg-stone-100 text-stone-400 p-2 rounded-lg hover:bg-rose-500 hover:text-white disabled:opacity-0 transition-all"
              >
                <Plus size={18} />
              </button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CategorySection;