import { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import hollywoodLogo from './assets/hollywoodlogo.png';
import toytasticLogo from './assets/plaintoytastic.png';

function App() {
  const { data, loading } = useInventory();
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return <div className="p-6 text-[#FEBD14] text-center bg-slate-950 min-h-screen">Loading Trade Hub...</div>;

  // Filter items based on user search query
  const filteredData = data.filter(item => 
    item['Describe your sketch']?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item['Submission ID']?.toString().includes(searchQuery)
  );

  return (
    <div className="bg-[#0b132b] min-h-screen pb-24 text-white font-sans selection:bg-[#FEBD14]/30">
      
      {/* 1. Header Section with Logos & Branding */}
      <header className="border-b border-slate-800 bg-[#0f172a] px-4 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          {/* Host Logo Placeholder (Toytastic Side) */}
          <div className="flex flex-col">
            <img 
              src={toytasticLogo} 
              alt="Toytastic trade night" 
              className="max-h-[75px] object-contain drop-shadow-[0_2px_4px_rgba(239,68,68,0.2)]"
            />
          </div>

          {/* Event Context */}
          <div className="text-right border-l border-slate-700 pl-4">
            <h1 className="text-xs font-bold tracking-widest text-slate-200 uppercase">
              Nationals
            </h1>
            <p className="text-[10px] font-bold text-[#FEBD14] uppercase tracking-wider">
              Sketch Trade Hub
            </p>
          </div>
        </div>

        {/* Sponsor/Donation Sub-Header using your asset */}
        <div className="max-w-md mx-auto mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-center gap-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Sketches Donated by:
          </span>
            <a target="_blank" href="https://hollywoodtradingcards.com/">
            <img 
              src={hollywoodLogo} 
              alt="Hollywood Trading Cards" 
              className="max-h-[75px] object-contain drop-shadow-[0_2px_4px_rgba(239,68,68,0.2)]"
            />
          </a>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-md mx-auto px-4 pt-5">
        
        {/* Call to Action Banner */}
        <div className="text-center mb-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-3 px-4 rounded-xl border border-slate-800 shadow-inner">
          <p className="text-sm font-extrabold text-slate-100 uppercase tracking-wide">
            <a target="_blank" href="https://tally.so/r/kd1VJd">
              Upload your card to trade here!
            </a>
          </p>
        </div>

        {/* 2. Utility & Search Area */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search by description ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e293b] text-sm text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-[#FEBD14] focus:ring-1 focus:ring-[#FEBD14] transition-all"
            />
            <span className="absolute left-3 top-3.5 text-slate-400 text-xs">🔍</span>
          </div>
        </div>

        {/* 3. Mobile UI optimized Sketch Cards */}
        <div className="space-y-3">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div 
                key={item['Submission ID']} 
                className="bg-[#111827] border border-slate-800 hover:border-slate-700 p-3 rounded-2xl flex flex-col gap-3 shadow-sm transition-all"
              >
                <div className="flex gap-3 items-center">
                  {/* Sketch Image Thumbnail Container */}
                  <button 
                    onClick={() => setSelectedImage(item['Upload your sketch'])}
                    className="w-24 h-24 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800 relative group active:scale-95 transition-transform"
                  >
                    <img 
                      src={item['Upload your sketch']} 
                      alt={item['Describe your sketch']} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] bg-slate-950/80 px-1.5 py-0.5 rounded text-white">View</span>
                    </div>
                  </button>

                  {/* Thumb-friendly action buttons */}
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <button 
                      onClick={() => setSelectedImage(item['Upload your sketch'])}
                      className="w-full border border-slate-700 hover:bg-slate-800 active:scale-95 text-slate-300 font-semibold text-xs px-2.5 py-2 rounded-lg transition-all uppercase"
                    >
                      View Details
                    </button>
                    {/* <button 
                      className="w-full bg-[#FEBD14] hover:bg-[#e5aa12] active:scale-95 text-slate-900 font-bold text-xs px-2.5 py-2 rounded-lg transition-all uppercase"
                    >
                      I want to trade
                    </button> */}
                  </div>
                </div>

                {/* Description footer */}
                <p className="text-sm font-bold text-slate-200 leading-snug pt-2 border-t border-slate-800">
                  {item['Describe your sketch']}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              No matching sketches available right now.
            </div>
          )}
        </div>
      </main>
      
      <footer className="text-center py-6 text-xs text-slate-500">
        Powered by{' '}
        <a 
          href="https://mojocollectibles.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-300 hover:text-[#FEBD14] transition-colors font-semibold"
        >
          Mojo Collectibles
        </a>
      </footer>

      {/* 4. Sticky Bottom Mobile Navigation Menu */}
      {/* <nav className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 py-2.5 z-40 shadow-xl">
        <div className="max-w-md mx-auto flex justify-center text-center">
          <button className="flex flex-col items-center gap-0.5 text-[#FEBD14]">
            <span className="text-base">📝</span>
            <span className="text-[10px] font-bold tracking-wide uppercase">Sketches</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-200">
            <span className="text-base">📋</span>
            <span className="text-[10px] font-bold tracking-wide uppercase">Rules</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-200">
            <span className="text-base">🗺️</span>
            <span className="text-[10px] font-bold tracking-wide uppercase">Map</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-200">
            <span className="text-base">👤</span>
            <span className="text-[10px] font-bold tracking-wide uppercase">My Trades</span>
          </button>
        </div>
      </nav> */}

      {/* Full-Screen Immersive Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-sm max-h-[80vh] flex items-center justify-center">
            <img src={selectedImage} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" alt="Previewed Sketch Card" />
          </div>
          <p className="text-slate-400 text-xs mt-4 uppercase tracking-widest">Tap anywhere to close</p>
        </div>
      )}
    </div>
  );
}

export default App;