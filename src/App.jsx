import { useState } from 'react';
import { useInventory } from './hooks/useInventory';

function App() {
  const { data, loading } = useInventory();
  const [selectedImage, setSelectedImage] = useState(null);

  if (loading) return <div className="p-6 text-[#FEBD14]">Loading Trade Hub...</div>;

  return (
    <div className="bg-slate-950 min-h-screen p-2 md:p-8">
      <h1 className="text-xl md:text-4xl font-bold text-[#FEBD14] uppercase mb-6 text-center">
        Trade Night - Sketches Available!
      </h1>
      <p className="text-xl md:text-xl text-[#FEBD14] mb-9 text-center">
        Come over to the Sketch Trading Table to trade-up!
      </p>

      {/* Two-up on mobile (grid-cols-2), 4-up on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
        {data.map((item, index) => (
          <div key={index} className="border border-[#FEBD14] bg-slate-900 p-4 rounded-xl">
            <button 
              onClick={() => setSelectedImage(item.Image_Preview)}
              className="w-full aspect-square bg-slate-800 overflow-hidden"
            >
              <img src={item.Image_Preview} alt={item.Card_Description} className="w-full h-full object-cover rounded-md" />
            </button>
            <h2 className="text-[#FEBD14] text-xs md:text-sm mt-2">{item.Card_Description}</h2>
            <p className="text-[#FEBD14] text-xs md:text-xs mt-1">#{item.QR_ID}</p>
          </div>
        ))}
      </div>

      {/* Full-Screen Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}

export default App;
