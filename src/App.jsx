import { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import hollywoodLogo from './assets/hollywoodlogo.png';
import toytasticLogo from './assets/plaintoytastic.png';

// Helper function to handle raw strings, JSON arrays, or comma-separated URLs from Tally / Sheets
const extractUrls = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.flatMap(extractUrls);
  }
  if (typeof val === 'object' && val !== null) {
    return val.url ? [val.url] : [];
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        return extractUrls(JSON.parse(trimmed));
      } catch (e) {
        // Fall back to plain string if JSON parsing fails
      }
    }
    // Handle comma-separated URLs if multiple files are stored in a single cell
    return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

function App() {
  const { data, loading, updatePageStatus } = useInventory();
  const [selectedImages, setSelectedImages] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const isRequested = (item) =>
    item.Page_Status === 'PAGE' || item.Page_Status === 'Paged';

  const handleWantThis = async (submissionId, item) => {
    console.log('[I\'m interested] clicked', {
      submissionId,
      submissionIdType: typeof submissionId,
      currentPageStatus: item?.Page_Status,
      isRequested: isRequested(item),
    });

    setUpdatingId(submissionId);
    try {
      const result = await updatePageStatus(submissionId);
      console.log('[I\'m interested] updatePageStatus result', { submissionId, result });
    } catch (err) {
      console.error('[I\'m interested] failed to update page status', {
        submissionId,
        error: err,
        message: err?.message,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="p-6 text-[#FEBD14] text-center bg-slate-950 min-h-screen">Loading Trade Hub...</div>;

  // Filter items based on user search query, then reverse to show newest submissions first
  const filteredData = data.filter(item => 
    item['Describe your sketch']?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item['Submission ID']?.toString().includes(searchQuery)
  ).slice().reverse();

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
            <a target="_blank" href="https://hollywoodtradingcards.com/" rel="noreferrer">
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
            <a target="_blank" href="https://tally.so/r/kd1VJd" rel="noreferrer">
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
            filteredData.map((item) => {
              // Primary sketch images
              const firstImages = extractUrls(item['Upload your sketch']);

              // Dynamically check potential key variations for the second image to avoid undefined mismatches
              const secondImageKey = Object.keys(item).find(
                key => key.trim().toLowerCase() === 'second image' || key.trim().toLowerCase() === 'secondimage'
              );
              const rawSecond = secondImageKey ? item[secondImageKey] : null;
              const secondImages = extractUrls(rawSecond);

              // Fallback: if multiple files were uploaded inside the main sketch field directly
              const allImages = firstImages.length > 1 && secondImages.length === 0 
                ? firstImages 
                : [...firstImages, ...secondImages];

              const thumbnailSrc = allImages[0];

              const handleViewImages = () => {
                console.log('--- DEBUG ITEM CLICKED ---', {
                  submissionId: item['Submission ID'],
                  description: item['Describe your sketch'],
                  detectedSecondImageKey: secondImageKey || 'NOT FOUND',
                  rawSecondImageValue: rawSecond,
                  allImagesCombined: allImages,
                  fullItemKeys: Object.keys(item),
                  fullItemObject: item
                });
                setSelectedImages(allImages);
              };

              return (
                <div 
                  key={item['Submission ID']} 
                  className="bg-[#111827] border border-slate-800 hover:border-slate-700 p-3 rounded-2xl flex flex-col gap-3 shadow-sm transition-all"
                >
                  <div className="flex gap-3 items-center">
                    {/* Sketch Image Thumbnail Container */}
                    <button 
                      onClick={handleViewImages}
                      className="w-24 h-24 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800 relative group active:scale-95 transition-transform"
                    >
                      {thumbnailSrc ? (
                        <img 
                          src={thumbnailSrc} 
                          alt={item['Describe your sketch'] || 'Sketch Card'} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] bg-slate-950/80 px-1.5 py-0.5 rounded text-white">View</span>
                      </div>
                    </button>

                    {/* Thumb-friendly action buttons */}
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <button 
                        onClick={handleViewImages}
                        className="w-full border border-slate-700 hover:bg-slate-800 active:scale-95 text-slate-300 font-semibold text-xs px-2.5 py-2 rounded-lg transition-all uppercase"
                      >
                        View Image(s)
                      </button>
                      <button
                        onClick={() => handleWantThis(item['Submission ID'], item)}
                        disabled={
                          isRequested(item) ||
                          updatingId === item['Submission ID']
                        }
                        className="w-full bg-[#FEBD14] hover:bg-[#e5aa12] disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-95 text-slate-900 font-bold text-xs px-2.5 py-2 rounded-lg transition-all uppercase"
                      >
                        {isRequested(item)
                          ? 'Requested'
                          : updatingId === item['Submission ID']
                            ? 'Owner has been paged'
                            : 'I\'m interested'}
                      </button>
                    </div>
                  </div>

                  {/* Description footer */}
                  <p className="text-sm font-bold text-slate-200 leading-snug pt-2 border-t border-slate-800">
                    {item['Describe your sketch']}
                  </p>
                </div>
              );
            })
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

      {/* Full-Screen Immersive Lightbox Modal */}
      {selectedImages && selectedImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedImages(null)}
        >
          <div className="relative w-full max-w-sm flex flex-col gap-5 items-center justify-center my-auto py-6">
            {selectedImages.map((imgUrl, index) => (
              <div key={index} className="w-full flex flex-col items-center">
                <span className="text-xs font-bold text-[#FEBD14] mb-1.5 uppercase tracking-wider bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
                  {index === 0 ? 'Front / Sketch' : `Second Image`}
                </span>
                <img 
                  src={imgUrl} 
                  className="max-w-full max-h-[38vh] object-contain rounded-xl shadow-2xl border border-slate-800 bg-black/40" 
                  alt={`Previewed Card Image ${index + 1}`} 
                />
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest flex-shrink-0 pb-4">Tap anywhere to close</p>
        </div>
      )}
    </div>
  );
}

export default App;
