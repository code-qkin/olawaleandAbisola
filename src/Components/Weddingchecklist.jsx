import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Plus, Edit2 } from 'lucide-react';
// IMPORT from your new file
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Component Imports
import Countdown from './Countdown';
import ProgressBar from './ProgressBar';
import CategorySection from './CategorySection';
import ConfirmModal from './ConfirmModal';




const INITIAL_DATA = [
  {
    id: 'cat-1',
    title: 'Just Engaged (12+ Months)',
    items: [
      { id: 1, text: 'Announce the engagement!', completed: true },
      { id: 2, text: 'Determine total budget', completed: false },
    ]
  },
];

const Weddingchecklist = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [coupleName, setCoupleName] = useState("Olawale & Abisola");
  const [weddingDate, setWeddingDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  });

  const [loading, setLoading] = useState(true);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deleteModal, setDeleteModal] = useState({ issOpen: false, categoryId: null, });

  const PLANNER_DOC_ID = 'my-wedding-planner';

  // --- Auth & Data Sync ---
  useEffect(() => {
    // Simple Anonymous Sign In
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        signInAnonymously(auth).catch((error) => {
          console.error("Auth Error:", error);
        });
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Use a simpler path: collection "planners", document "my-wedding-planner"
    const docRef = doc(db, 'planners', PLANNER_DOC_ID);

    const unsubscribeSnapshot = onSnapshot(docRef, (snapshot) => {
      setLoading(false);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.categories) setCategories(data.categories);
        if (data.weddingDate) setWeddingDate(data.weddingDate);
        if (data.coupleName) setCoupleName(data.coupleName);
      } else {
        // Initialize if document doesn't exist
        const initialData = {
          categories: INITIAL_DATA,
          weddingDate: weddingDate,
          coupleName: coupleName,
          createdAt: new Date().toISOString()
        };
        setDoc(docRef, initialData);
        setCategories(INITIAL_DATA);
      }
    }, (error) => {
      console.error("Sync error:", error);
      setLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  const saveToCloud = (updates) => {
    if (!user) return;
    const docRef = doc(db, 'planners', PLANNER_DOC_ID);
    setDoc(docRef, {
      ...updates,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  };


 
  

  const handleDateChange = (e) => {
    setWeddingDate(e.target.value);
    saveToCloud({ weddingDate: e.target.value });
  };

  const toggleTask = (catId, taskId) => {
    const newCats = categories.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item =>
          item.id === taskId ? { ...item, completed: !item.completed } : item
        )
      };
    });
    setCategories(newCats);
    saveToCloud({ categories: newCats });
  };

  const deleteTask = (catId, taskId) => {
    const newCats = categories.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.filter(item => item.id !== taskId)
      };
    });
    setCategories(newCats);
    saveToCloud({ categories: newCats });
  };

  const addTask = (catId, text) => {
    const newCats = categories.map(cat => {
      if (cat.id !== catId) return cat;
      const newItem = { id: Date.now(), text, completed: false };
      return { ...cat, items: [...cat.items, newItem] };
    });
    setCategories(newCats);
    saveToCloud({ categories: newCats });
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      title: newCategoryName,
      items: []
    };
    const newCats = [...categories, newCat];
    setCategories(newCats);
    saveToCloud({ categories: newCats });
    setNewCategoryName("");
    setIsAddingCategory(false);
  };

  const requestDeleteCategory = (catId) => {
    setDeleteModal({ isOpen: true, categoryId: catId });
  };

  const confirmDeleteCategory = () => {
    if (!deleteModal.categoryId) return;

    const newCats = categories.filter(c => c.id !== deleteModal.categoryId);
    setCategories(newCats);
    saveToCloud({ categories: newCats });
    setDeleteModal({ isOpen: false, categoryId: null });
  };

  const safeCategories = Array.isArray(categories) ? categories : [];
  const totalTasks = safeCategories.reduce((acc, cat) => acc + (cat.items ? cat.items.length : 0), 0);
  const completedTasks = safeCategories.reduce((acc, cat) => acc + (cat.items ? cat.items.filter(i => i.completed).length : 0), 0);
  const overallProgress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] text-rose-400">
        <div className="flex flex-col items-center gap-4">
          <Heart className="animate-pulse" size={48} />
          <p className="font-serif italic">Loading Planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 font-sans selection:bg-rose-100">

      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000')` }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-rose-900/20 to-[#FDFCFB]"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pt-10">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-rose-200 shadow-lg text-rose-600 text-xs font-bold uppercase tracking-widest mb-6">
            <Heart size={12} className="fill-current" />
            The Ultimate Wedding Planner
          </div>

          <div className="group relative mb-6">
            <div className="mb-6">
              <h1 className="text-5xl md:text-7xl font-serif text-rose-900 drop-shadow-sm">
                {coupleName}
              </h1>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mb-8 group">
            {isEditingDate ? (
              <input
                type="date"
                value={weddingDate}
                onChange={handleDateChange}
                onBlur={() => setIsEditingDate(false)}
                className="bg-white/90 border-none rounded px-4 py-2 font-serif text-xl outline-none text-stone-800 shadow-lg"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingDate(true)}
                className="flex items-center gap-2 text-rose-700 hover:text-rose-900 transition-colors font-serif text-xl bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-rose-200 hover:bg-white/70 shadow-sm"
              >
                <Calendar size={18} />
                <span>{new Date(weddingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </button>
            )}
          </div>

          <Countdown targetDate={weddingDate} />
        </div>
      </div>

      <ProgressBar progress={overallProgress} />

      <main className="max-w-3xl mx-auto px-4 py-12 -mt-10 relative z-20">

        {/* Dashboard Header */}
        <div className="flex justify-between items-end mb-8 px-2 pb-4">
          <div className="bg-white/80 backdrop-blur px-6 py-4 rounded-2xl shadow-sm border border-rose-50 w-full flex justify-between items-center">
            <div>
              <h2 className="font-serif text-2xl text-stone-800">Your Checklist</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Synced with Partner</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-serif text-rose-500">{totalTasks - completedTasks}</span>
              <span className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold">Tasks Left</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {safeCategories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onAddTask={addTask}
              onDeleteCategory={requestDeleteCategory} // <--- Updated function here
            />
          ))}
        </div>

        {/* Add Category Section */}
        <div className="mt-8">
          {isAddingCategory ? (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex gap-2 animate-in fade-in slide-in-from-bottom-4">
              <input
                autoFocus
                type="text"
                placeholder="New Category Name (e.g. Honeymoon, Flowers)"
                className="flex-grow bg-stone-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              />
              <button
                onClick={addCategory}
                className="bg-stone-800 text-white px-6 rounded-lg font-medium hover:bg-stone-700"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingCategory(false)}
                className="text-stone-400 px-4 hover:text-stone-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCategory(true)}
              className="w-full py-4 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} /> Add New Category
            </button>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-16 text-stone-300 text-xs uppercase tracking-widest font-bold">
          <p className="mb-2">Made for {coupleName}</p>
          <Heart size={12} className="inline-block text-rose-300 animate-pulse" />
        </footer>

        {/* Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
          onConfirm={confirmDeleteCategory}
          title="Delete Category?"
          message="This will permanently remove this category and all its tasks. This action cannot be undone."
          isDanger={true}
        />

      </main>
    </div>
  );
};

export default Weddingchecklist;
