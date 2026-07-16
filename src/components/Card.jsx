export const Card = ({ item }) => {
    return (
      <div className="border-2 border-cyan-400 p-4 bg-slate-900 text-cyan-100 font-mono">
        <img src={item.ImageUrl} alt={item.Description} className="w-full h-auto mb-4" />
        <h3 className="text-lg font-bold">{item.Description}</h3>
        <p className="text-sm">Status: {item.Status}</p>
      </div>
    );
  };