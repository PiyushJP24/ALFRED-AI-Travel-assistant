import { Star, Tag, Heart, ExternalLink, Plane } from "lucide-react";
import { toast } from "sonner";

export default function HotelOptions({ flightLabel, flightPriceLabel, hotels, onSelectHotel, onBookFlight }) {
  return (
    <div data-testid="hotel-options-block" className="space-y-2.5">
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Plane className="w-3.5 h-3.5 text-[#005B9B]" />
            Best Flight Deal: <span className="text-slate-800">{flightLabel}</span>
          </p>
          <p className="text-xs font-bold text-[#FF6B00]">Live Price: {flightPriceLabel}</p>
        </div>
        <div className="flex gap-2 mt-2.5">
          <button
            data-testid="flight-check-book-button"
            onClick={onBookFlight}
            className="flex-1 text-xs font-bold py-2 rounded-xl bg-[#6D5BD0] text-white hover:bg-[#5b4bc0] transition-colors"
          >
            Check & Book Now
          </button>
          <button
            data-testid="flight-book-here-button"
            onClick={onBookFlight}
            className="flex-1 text-xs font-bold py-2 rounded-xl bg-[#005B9B] text-white hover:bg-[#004C8F] transition-colors"
          >
            Book Here
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {hotels.map((h, i) => (
          <div
            key={h.id}
            data-testid={`hotel-card-${i}`}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          >
            <img src={h.image} alt={h.name} className="h-20 w-full object-cover" />
            <div className="p-2.5 space-y-1.5">
              <h5 className="text-xs font-bold text-slate-900 leading-tight truncate">{h.name}</h5>
              <p className="flex items-center gap-1 text-[11px] text-slate-600">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800">{h.rating}</span> ({h.reviews} Reviews)
              </p>
              <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                <Tag className="w-3 h-3 text-[#FF6B00]" />
                ₹{h.pricePerNight.toLocaleString("en-IN")} / night
              </p>
              <button
                data-testid={`hotel-open-button-${i}`}
                onClick={() => toast.info("Hotel details page is coming soon in the live version!")}
                className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 rounded-lg border border-[#005B9B]/40 text-[#005B9B] hover:bg-sky-50 transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> Open
              </button>
              <div className="flex gap-1.5">
                <button
                  data-testid={`hotel-save-button-${i}`}
                  onClick={() => toast.success(`${h.name} saved to your shortlist`)}
                  className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 rounded-lg bg-[#6D5BD0] text-white hover:bg-[#5b4bc0] transition-colors"
                >
                  <Heart className="w-3 h-3" /> Save
                </button>
                <button
                  data-testid={`hotel-select-button-${i}`}
                  onClick={() => onSelectHotel(h)}
                  className="flex-1 text-[11px] font-bold py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
