import { X, Briefcase, Heart, Settings, Map, LogOut } from "lucide-react";
import { AVATAR_URL, USER_NAME } from "../data/alfredData";

const LINKS = [
  { icon: Briefcase, label: "My Bookings" },
  { icon: Heart, label: "Saved Trips" },
  { icon: Map, label: "Travel Guides" },
  { icon: Settings, label: "Settings" },
];

export default function MenuDrawer({ open, onClose, onAction }) {
  if (!open) return null;
  return (
    <div
      data-testid="menu-drawer"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-full max-w-xs bg-white shadow-2xl flex flex-col animate-slide-in-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#005B9B] to-[#00A4D5]">
          <div className="flex items-center gap-3">
            <img src={AVATAR_URL} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50" />
            <div>
              <p className="text-sm font-bold text-white">{USER_NAME}</p>
              <p className="text-[11px] text-sky-100">EaseMyTrip Traveller</p>
            </div>
          </div>
          <button
            data-testid="menu-close-button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3">
          {LINKS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              data-testid={`menu-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onAction(label)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#005B9B] transition-colors"
            >
              <Icon className="w-4.5 h-4.5 w-5 h-5 text-slate-400" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button
            data-testid="menu-logout-button"
            onClick={() => onAction("Log out")}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
