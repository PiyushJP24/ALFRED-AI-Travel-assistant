import { useState } from "react";
import {
  X,
  Heart,
  Share2,
  MapPin,
  GripVertical,
  Plus,
  CalendarPlus,
  Hotel,
  Map,
  Coffee,
  UtensilsCrossed,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";

function StopIcon({ kind, label }) {
  if (kind === "meal") {
    return label === "Breakfast" ? (
      <Coffee className="w-4 h-4 text-amber-600" />
    ) : (
      <UtensilsCrossed className="w-4 h-4 text-rose-500" />
    );
  }
  return <Landmark className="w-4 h-4 text-[#005B9B]" />;
}

export default function ItineraryEditorModal({
  itinerary,
  onClose,
  onUpdateDays,
  onShare,
  saved,
  onSave,
  onBook,
}) {
  const { destination, plan, days } = itinerary;
  const [activeDay, setActiveDay] = useState(0);
  const [dragIndex, setDragIndex] = useState(null);

  const day = days[activeDay];

  const reorder = (from, to) => {
    if (from === null || from === to) return;
    const stops = [...day.stops];
    const [moved] = stops.splice(from, 1);
    stops.splice(to, 0, moved);
    const next = days.map((d, i) => (i === activeDay ? { ...d, stops } : d));
    onUpdateDays(next);
  };

  const addStop = () => {
    const places = day.stops.filter((s) => s.kind === "place").length;
    const stop = {
      id: `s-new-${Date.now()}`,
      kind: "place",
      label: `Place ${places + 1}`,
      detail: destination.places[(activeDay * 3 + places) % destination.places.length],
    };
    const stops = [...day.stops.slice(0, -1), stop, day.stops[day.stops.length - 1]];
    const next = days.map((d, i) => (i === activeDay ? { ...d, stops } : d));
    onUpdateDays(next);
    toast.success("Stop added to " + day.label);
  };

  const addDay = () => {
    const n = days.length;
    const p = destination.places;
    const e = destination.eats;
    const newDay = {
      id: `day-${n + 1}-${Date.now()}`,
      label: `Day ${n + 1}`,
      stops: [
        { id: `s-${n}-0-${Date.now()}`, kind: "meal", label: "Breakfast", detail: e[n % e.length] },
        { id: `s-${n}-1-${Date.now()}`, kind: "place", label: "Place 1", detail: p[(n * 3) % p.length] },
        { id: `s-${n}-2-${Date.now()}`, kind: "meal", label: "Lunch", detail: e[(n + 1) % e.length] },
        { id: `s-${n}-3-${Date.now()}`, kind: "place", label: "Place 2", detail: p[(n * 3 + 1) % p.length] },
        { id: `s-${n}-4-${Date.now()}`, kind: "place", label: "Place 3", detail: p[(n * 3 + 2) % p.length] },
        { id: `s-${n}-5-${Date.now()}`, kind: "meal", label: "Dinner", detail: e[(n + 2) % e.length] },
      ],
    };
    onUpdateDays([...days, newDay]);
    setActiveDay(n);
    toast.success(`Day ${n + 1} added to your itinerary`);
  };

  return (
    <div
      data-testid="itinerary-editor-modal"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-2xl h-[92dvh] md:h-[85vh] bg-white md:rounded-2xl rounded-t-2xl flex flex-col overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative shrink-0">
          <img src={destination.image} alt={destination.name} className="w-full h-28 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
          <button
            data-testid="itinerary-editor-close-button"
            onClick={onClose}
            className="absolute top-3 left-3 p-1.5 rounded-full bg-white/90 text-slate-800 hover:bg-white transition-colors"
          >
            <X className="w-4.5 h-4.5 w-5 h-5" />
          </button>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              data-testid="editor-save-button"
              onClick={onSave}
              className={`p-1.5 rounded-full transition-colors ${
                saved ? "bg-[#FF6B00] text-white" : "bg-white/90 text-rose-500 hover:bg-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${saved ? "fill-white" : ""}`} />
            </button>
            <button
              data-testid="editor-share-button"
              onClick={onShare}
              className="p-1.5 rounded-full bg-white/90 text-slate-800 hover:bg-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="flex items-center gap-1.5 text-white font-bold text-base">
              <MapPin className="w-4 h-4 text-[#00A4D5]" />
              {destination.name}
            </p>
            <p className="text-xs text-slate-200 mt-0.5">
              {days.length} Day stay for {plan.theme}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Itineraries</h3>
          <button
            data-testid="pick-hotel-deals-button"
            onClick={() => toast.success("Best hotel deals added to your shortlist!")}
            className="text-xs font-semibold text-[#6D5BD0] border border-[#6D5BD0]/40 rounded-full px-3 py-1 hover:bg-violet-50 transition-colors"
          >
            <span className="flex items-center gap-1">
              <Hotel className="w-3.5 h-3.5" /> Pick Best Hotel Deals
            </span>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="shrink-0 w-[74px] border-r border-slate-100 overflow-y-auto py-3 px-2 flex flex-col items-center gap-1">
            {days.map((d, i) => (
              <div key={d.id} className="flex flex-col items-center">
                <button
                  data-testid={`itinerary-day-tab-${i + 1}`}
                  onClick={() => setActiveDay(i)}
                  className={`w-full text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                    i === activeDay
                      ? "bg-[#005B9B] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {d.label}
                </button>
                {i < days.length - 1 && <span className="w-px h-2 bg-slate-200" />}
              </div>
            ))}
            <button
              data-testid="itinerary-add-day-button"
              onClick={addDay}
              className="mt-1 flex flex-col items-center gap-1 text-[11px] font-semibold text-[#FF6B00] hover:text-orange-700 transition-colors px-1 py-1.5"
            >
              <CalendarPlus className="w-4 h-4" />
              Add Day
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
            {day.stops.map((s, i) => (
              <div
                key={s.id}
                data-testid={`itinerary-stop-row-${i}`}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  reorder(dragIndex, i);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                className={`itinerary-stop-row flex items-center gap-2.5 bg-white border rounded-xl px-3 py-2.5 shadow-sm cursor-grab active:cursor-grabbing transition-all ${
                  dragIndex === i ? "opacity-40 border-[#00A4D5] border-dashed" : "border-slate-200 hover:border-[#00A4D5]/50"
                }`}
              >
                <span
                  data-testid={`itinerary-stop-drag-handle-${i}`}
                  className="text-slate-300 hover:text-slate-500 shrink-0"
                >
                  <GripVertical className="w-4 h-4" />
                </span>
                <StopIcon kind={s.kind} label={s.label} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{s.label}</p>
                  <p className="text-xs text-slate-500 truncate">{s.detail}</p>
                </div>
              </div>
            ))}
            <button
              data-testid="itinerary-add-activity-button"
              onClick={addStop}
              className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-300 rounded-xl py-2.5 text-sm font-semibold text-slate-500 hover:text-[#005B9B] hover:border-[#005B9B]/50 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add More
            </button>
            <button
              data-testid="map-view-button"
              onClick={() => toast.info("Map view is coming soon in the live version!")}
              className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#005B9B] py-2 transition-colors"
            >
              <Map className="w-4 h-4" /> Map View
            </button>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 p-3 sm:p-4">
          <button
            data-testid="itinerary-book-now-button"
            onClick={onBook}
            className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/25"
          >
            Book this trip on EaseMyTrip
          </button>
        </div>
      </div>
    </div>
  );
}
