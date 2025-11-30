import React, { useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Heart, Calendar, MapPin, Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

// 1. InviteCard is now a simple component (No forwardRef needed)
const InviteCard = ({ name, location, date }) => (
  <div 
    className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100 relative mx-auto"
    // Double safety: Inline styles for the generator to read
    style={{ backgroundColor: '#ffffff', color: '#1c1917', minHeight: '500px' }} 
  >
    {/* Decorative Top */}
    <div className="h-32 bg-rose-100 flex items-center justify-center relative overflow-hidden">
      <Heart size={48} className="text-rose-300" fill="currentColor" />
    </div>

    {/* Content */}
    <div className="px-8 py-10 text-center">
      <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">You Are Invited</p>
      
      <h1 className="font-serif text-4xl text-rose-900 mb-2">
        Olawale & Abisola's
      </h1>
      <p className="font-serif text-xl text-stone-600 italic mb-8">Wedding Celebration</p>

      <div className="bg-stone-50 rounded-xl p-6 mb-8 border border-stone-100">
        <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">Exclusive Invite For</p>
        <h2 className="text-3xl font-bold text-stone-800 font-serif break-words">
          {name}
        </h2>
      </div>

      <div className="space-y-4 text-stone-600 text-sm mb-8">
        {/* Dynamic Date Display */}
        <div className="flex items-center justify-center gap-2">
          <Calendar size={16} className="text-rose-400" />
          <span>{date}</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <MapPin size={16} className="text-rose-400" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  </div>
);

const InviteViewer = ({ previewName, previewLocation, previewDate }) => {
  const { name } = useParams(); 
  const [searchParams] = useSearchParams();
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Logic: Use Prop (Preview) -> URL Param (Live) -> Default
  const finalName = previewName || decodeURIComponent(name || "Guest").replace(/\+/g, ' ');
  
  const urlLocation = searchParams.get('location');
  const finalLocation = previewLocation || (urlLocation ? decodeURIComponent(urlLocation) : "Grand Hotel, City Center");

  const urlDate = searchParams.get('date');
  const finalDate = previewDate || (urlDate ? decodeURIComponent(urlDate) : "October 12, 2025 • 4:00 PM");

  // PREVIEW MODE (Return just the card)
  if (previewName) {
    return <InviteCard name={finalName} location={finalLocation} date={finalDate} />;
  }

  // LIVE MODE
  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      // Small delay to ensure rendering is complete
      setTimeout(async () => {
        const dataUrl = await toPng(cardRef.current, { 
          cacheBust: true,
          backgroundColor: '#ffffff', // Force white background
          quality: 1.0,
          pixelRatio: 2,
          // Exclude the button if it somehow gets inside the ref (it shouldn't, but safety first)
          filter: (node) => node.tagName !== 'BUTTON' 
        });
        saveAs(dataUrl, `Wedding-Invite-${finalName.replace(/\s+/g, '-')}.png`);
        setIsDownloading(false);
      }, 200); // Increased delay slightly
    } catch (err) {
      console.error('Download failed', err);
      alert('Could not download image. Please try again.');
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-4 gap-8">
      
      {/* THE FIX: Wrap the component in a plain DIV with the REF.
         This ensures the capture tool sees a standard HTML element.
      */}
      <div 
        ref={cardRef} 
        className="relative bg-white rounded-2xl overflow-hidden"
        style={{ width: '100%', maxWidth: '28rem' }} // Force explicit width matching max-w-md
      >
        <InviteCard name={finalName} location={finalLocation} date={finalDate} />
      </div>

      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex items-center gap-2 bg-white text-stone-800 px-6 py-3 rounded-full shadow-lg border border-stone-200 font-medium hover:bg-stone-50 hover:text-rose-600 transition-all disabled:opacity-50"
      >
        {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
        <span>{isDownloading ? 'Saving...' : 'Download Invitation'}</span>
      </button>

    </div>
  );
};

export default InviteViewer;


// const handleDownload = async () => {
//     if (cardRef.current === null) return;
    
//     setIsDownloading(true);
//     try {
//       const dataUrl = await toPng(cardRef.current, { 
//         cacheBust: true, 
//         backgroundColor: '#ffffff',
//         quality: 1.0 
//       });
//       saveAs(dataUrl, `Wedding-Invite-${finalName.replace(/\s+/g, '-')}.png`);
//     } catch (err) {
//       console.error('Could not generate image', err);
//       alert('Failed to download. Please try again.');
//     }
//     setIsDownloading(false);
//   };
