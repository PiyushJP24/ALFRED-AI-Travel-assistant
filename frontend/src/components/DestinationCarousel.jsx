import { Heart, Share2, Star, Plane } from "lucide-react";

const TAG_STYLES = {
  Adventure: "bg-orange-100 text-orange-700 border-orange-300",
  Culture: "bg-violet-100 text-violet-700 border-violet-300",
  Relaxation: "bg-teal-100 text-teal-700 border-teal-300",
};

export default function DestinationCarousel({
  destinations,
  savedIds,
  onSelect,
  onSave,
  onShare,
}) {
  return (
    <div
      data-testid="destination-carousel-list"
      className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 carousel-scroll"
    >
      {destinations.map((d) => {
        const saved = savedIds.includes(d.id);
        return (
          <div
            key={d.id}
            data-testid={`destination-card-${d.id}`}
            className="destination-card-item snap-start shrink-0 w-[235px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              data-testid={`destination-select-button-${d.id}`}
              onClick={() => onSelect(d)}
              className="block w-full text-left"
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${TAG_STYLES[d.tag]}`}
                >
                  {d.tag}
                </span>
                <span className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> 4.8
                </span>
              </div>
              <div className="px-3 pt-2.5 pb-1">
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{d.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{d.blurb}</p>
                <p className="flex items-center gap-1 text-[11px] font-medium text-[#005B9B] mt-1.5">
                  <Plane className="w-3 h-3" />
                  {d.flight}
                </p>
              </div>
            </button>
            <div className="flex items-center gap-2 px-3 pb-3 pt-1.5">
              <button
                data-testid={`destination-save-button-${d.id}`}
                onClick={() => onSave(d)}
                className={`flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg transition-colors ${
                  saved
                    ? "bg-[#FF6B00] text-white"
                    : "bg-[#6D5BD0] text-white hover:bg-[#5b4bc0]"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${saved ? "fill-white" : ""}`} />
                {saved ? "Saved" : "Save"}
              </button>
              <button
                data-testid={`destination-share-button-${d.id}`}
                onClick={() => onShare(d)}
                className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg bg-[#6D5BD0] text-white hover:bg-[#5b4bc0] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
