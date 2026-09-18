import { X, Trash2, Route } from "lucide-react";

export default function SavedTripsDrawer({ open, savedDestinations, onClose, onRemove, onPlan }) {
  if (!open) return null;
  return (
    <div
      data-testid="saved-trips-drawer"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Saved Trips</h3>
          <button
            data-testid="saved-drawer-close-button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedDestinations.length === 0 && (
            <p data-testid="saved-empty-state" className="text-sm text-slate-500 text-center mt-10">
              Nothing saved yet. Tap the heart on any destination to keep it here.
            </p>
          )}
          {savedDestinations.map((d) => (
            <div
              key={d.id}
              data-testid={`saved-trip-item-${d.id}`}
              className="flex gap-3 bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm"
            >
              <img src={d.image} alt={d.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 truncate">{d.name}</p>
                <p className="text-[11px] text-slate-500">{d.dates} · {d.tag}</p>
                <div className="flex gap-2 mt-1.5">
                  <button
                    data-testid={`saved-plan-button-${d.id}`}
                    onClick={() => onPlan(d)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#005B9B] hover:underline"
                  >
                    <Route className="w-3 h-3" /> Plan this trip
                  </button>
                  <button
                    data-testid={`saved-trip-remove-button-${d.id}`}
                    onClick={() => onRemove(d)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:underline"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
