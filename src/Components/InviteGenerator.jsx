import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { Download, Link2, ChevronLeft, Check, Loader2, MapPin, Calendar } from 'lucide-react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import InviteViewer from './InviteViewer';

const InviteGenerator = () => {
  const { state } = useLocation(); 
  
  const [guestName, setGuestName] = useState('');
  const [location, setLocation] = useState('');
  const [dateString, setDateString] = useState('October 12, 2025 • 4:00 PM'); // Default text
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const captureRef = useRef(null);

  // Initialize Date from Checklist State if available
  useEffect(() => {
    if (state?.weddingDate) {
      const dateObj = new Date(state.weddingDate);
      // Format it nicely: "October 12, 2025 • 4:00 PM"
      const formatted = dateObj.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }) + ' • 4:00 PM';
      setDateString(formatted);
    }
  }, [state]);

  const handleDownload = async () => {
    if (!captureRef.current || !guestName.trim()) return;
    
    setIsDownloading(true);
    try {
      setTimeout(async () => {
        const dataUrl = await toPng(captureRef.current, { 
          cacheBust: true, 
          backgroundColor: '#ffffff',
          quality: 1.0,
          pixelRatio: 2 
        });
        saveAs(dataUrl, `Invite-${guestName.replace(/\s+/g, '-')}.png`);
        setIsDownloading(false);
      }, 100);
    } catch (err) {
      console.error('Could not generate image', err);
      alert('Failed to generate image. Please try again.');
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    if (!guestName.trim()) return;
    const baseUrl = `${window.location.origin}/invite/${encodeURIComponent(guestName.trim())}`;
    // Include both location and date in the URL
    const link = `${baseUrl}?location=${encodeURIComponent(location)}&date=${encodeURIComponent(dateString)}`;
    
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
        
      {/* Left Sidebar */}
      <div className="w-full md:w-96 bg-white p-8 border-r border-stone-100 flex flex-col h-auto md:h-screen z-10 shadow-sm overflow-y-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-rose-500 mb-8 font-medium transition-colors">
          <ChevronLeft size={20} /> Back to Planner
        </Link>
        
        <h1 className="font-serif text-3xl text-rose-900 mb-2">Invitation Studio</h1>
        <p className="text-stone-500 mb-8">Generate beautiful digital invites instantly.</p>

        <div className="space-y-6">
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Guest Name</label>
            <input 
              type="text" 
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Aunt May & Uncle Ben"
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-200 text-stone-800 font-serif text-lg placeholder:font-sans"
              autoFocus
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="d-block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <Calendar size={12} /> Date & Time
            </label>
            <input 
              type="text" 
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              placeholder="e.g. October 12, 2025 • 4:00 PM"
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-200 text-stone-600 text-sm"
            />
          </div>

          {/* Location Input */}
          <div>
            <label className="d-block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <MapPin size={12} /> Venue / Location
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. The Royal Gardens"
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-200 text-stone-600 text-sm"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={handleDownload}
              disabled={!guestName.trim() || isDownloading}
              className="flex items-center justify-center gap-2 w-full bg-stone-800 text-white py-3 rounded-xl font-medium hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
              {isDownloading ? 'Generating...' : 'Download Invite'}
            </button>

            <button 
              onClick={handleCopyLink}
              disabled={!guestName.trim()}
              className={`
                flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium border transition-all
                ${isCopied 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isCopied ? <Check size={20} /> : <Link2 size={20} />}
              {isCopied ? 'Link Copied!' : 'Copy Shareable Link'}
            </button>
          </div>
           <p className="text-center text-xs text-stone-400 mt-4">
             The link will direct guests to a live webpage view of this invitation.
           </p>
        </div>
      </div>

      {/* Right Area: Live Preview */}
      <div className="flex-grow bg-stone-100/50 flex items-center justify-center p-8 md:p-12 overflow-auto">
         <div className={`${guestName.trim() ? 'opacity-100' : 'opacity-50 grayscale'} transition-all duration-500 transform scale-[0.85] md:scale-100 shadow-2xl rounded-2xl`}>
            
            {/* CAPTURE TARGET */}
            <div ref={captureRef} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
                 <InviteViewer 
                    previewName={guestName || "Guest Name Preview"} 
                    previewLocation={location}
                    previewDate={dateString} // Pass the dynamic date
                 />
            </div>
         </div>
      </div>

    </div>
  );
};

export default InviteGenerator;