import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Menu,
  Heart,
  PenSquare,
  MapPin,
  Check,
} from "lucide-react";
import { CITIES, AVATAR_URL } from "../data/alfredData";

export default function Header({
  location,
  onLocationChange,
  savedCount,
  onOpenSaved,
  onNewChat,
  onOpenMenu,
}) {
  const [cityOpen, setCityOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setCityOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="relative z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-5 h-12">
        <button
          data-testid="header-back-button"
          className="flex items-center gap-1 text-slate-800 hover:text-[#005B9B] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          <span className="text-base font-bold tracking-tight">Alfred</span>
        </button>

        <div className="relative" ref={dropRef}>
          <button
            data-testid="header-location-selector"
            onClick={() => setCityOpen((o) => !o)}
            className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-[#005B9B] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
            {location}
            <ChevronDown className={`w-4 h-4 transition-transform ${cityOpen ? "rotate-180" : ""}`} />
          </button>
          {cityOpen && (
            <div
              data-testid="location-dropdown-menu"
              className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 animate-fade-in"
            >
              {CITIES.map((c) => (
                <button
                  key={c}
                  data-testid={`location-option-${c.toLowerCase()}`}
                  onClick={() => {
                    onLocationChange(c);
                    setCityOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {c}
                  {c === location && <Check className="w-4 h-4 text-[#005B9B]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 sm:px-5 h-12 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <button
            data-testid="header-menu-button"
            onClick={onOpenMenu}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img
            data-testid="header-user-avatar"
            src={AVATAR_URL}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00A4D5]/40"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <button
            data-testid="header-saved-list-button"
            onClick={onOpenSaved}
            className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-[#FF6B00] transition-colors"
          >
            <Heart className="w-5 h-5" />
            {savedCount > 0 && (
              <span
                data-testid="saved-count-badge"
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF6B00] text-white text-[10px] font-bold flex items-center justify-center"
              >
                {savedCount}
              </span>
            )}
          </button>
          <button
            data-testid="header-new-chat-button"
            onClick={onNewChat}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-[#005B9B] transition-colors"
          >
            <PenSquare className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="h-[3px] bg-gradient-to-r from-[#005B9B] via-[#00A4D5] to-[#FF6B00]" />
    </header>
  );
}
