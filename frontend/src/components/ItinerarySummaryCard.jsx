import { Heart, Share2, CalendarDays } from "lucide-react";

export default function ItinerarySummaryCard({ destination, plan, saved, onOpen, onSave, onShare }) {
  return (
    <div
      data-testid="itinerary-summary-card"
      className="w-[260px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md"
    >
      <div className="relative h-32">
        <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#00A4D5]">Itinerary</p>
          <h4 className="text-sm font-bold text-white leading-tight">{destination.name}</h4>
        </div>
      </div>
      <div className="px-3.5 py-3">
        <p className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <CalendarDays className="w-3.5 h-3.5 text-[#FF6B00]" />
          {plan.days} Day stay for {plan.theme}
        </p>
        <button
          data-testid="itinerary-open-editor-button"
          onClick={onOpen}
          className="w-full mt-3 bg-[#005B9B] hover:bg-[#004C8F] text-white text-sm font-bold py-2 rounded-xl transition-colors"
        >
          Open
        </button>
        <div className="flex gap-2 mt-2">
          <button
            data-testid="itinerary-save-button"
            onClick={onSave}
            className={`flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg transition-colors ${
              saved ? "bg-[#FF6B00] text-white" : "bg-[#6D5BD0] text-white hover:bg-[#5b4bc0]"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? "fill-white" : ""}`} />
            {saved ? "Saved" : "Save"}
          </button>
          <button
            data-testid="itinerary-share-button"
            onClick={onShare}
            className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg bg-[#6D5BD0] text-white hover:bg-[#5b4bc0] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
