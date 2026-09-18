import { useState } from "react";
import {
  Menu,
  ChevronDown,
  ChevronUp,
  PlaneTakeoff,
  Building2,
  TrainFront,
  Hotel,
  BusFront,
  Palmtree,
  Car,
  Ticket,
  Gift,
  Globe,
  TramFront,
  Home,
  Wallet,
  Mic,
  User,
  X,
} from "lucide-react";
import { ALFRED_AVATAR } from "../data/alfredData";

const PRIMARY = [
  { id: "flights", label: "Flights", sub: null, Icon: PlaneTakeoff, tint: "bg-sky-100 text-[#005B9B]" },
  { id: "hotels", label: "Hotels", sub: "Up to 60% Off*", Icon: Building2, tint: "bg-orange-100 text-[#FF6B00]" },
  { id: "trains", label: "Trains", sub: null, Icon: TrainFront, tint: "bg-emerald-100 text-emerald-600" },
];

const GRID = [
  { id: "flight-hotel", label: "Flight + Hotel", Icon: Hotel },
  { id: "bus", label: "Bus", Icon: BusFront },
  { id: "holidays", label: "Holidays", Icon: Palmtree },
  { id: "cabs", label: "Cabs", Icon: Car },
  { id: "activities", label: "Activities", Icon: Ticket },
  { id: "giftcard", label: "Gift Card", Icon: Gift },
  { id: "visa", label: "Visa", Icon: Globe },
  { id: "metro", label: "Metro", Icon: TramFront },
];

const NAV = [
  { id: "home", label: "Home", Icon: Home, active: true },
  { id: "bookings", label: "Bookings", Icon: Ticket },
  { id: "voice", label: "Voice Search", Icon: Mic, center: true },
  { id: "wallet", label: "Wallet", Icon: Wallet },
  { id: "profile", label: "Profile", Icon: User },
];

export default function HomeScreen({ onOpenChat }) {
  const [showPopup, setShowPopup] = useState(true);
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      data-testid="home-screen"
      className="min-h-screen w-full bg-gradient-to-b from-[#E8F2FB] to-[#F4F7FA] flex flex-col items-center"
    >
      <div className="w-full md:max-w-md flex-1 flex flex-col relative pb-24">
        {/* Header */}
        <header className="flex items-center justify-between px-5 pt-6 pb-4">
          <button data-testid="home-menu-button" className="p-1 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-extrabold tracking-tight text-[#0B6BB5]">EaseMy</span>
            <span className="text-2xl font-extrabold tracking-tight text-[#F58220]">Trip</span>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-slate-600">
            🇮🇳 India <ChevronDown className="w-4 h-4" />
          </button>
        </header>

        {/* Festival banner */}
        <div className="text-center px-5 pb-4">
          <p className="text-3xl font-black tracking-tight bg-gradient-to-r from-[#C8892B] via-[#E7B85C] to-[#C8892B] bg-clip-text text-transparent drop-shadow-sm">
            TRAVEL UTSAV
          </p>
          <p className="inline-block mt-1 text-[11px] font-bold text-white bg-[#0B2E5C] px-3 py-1 rounded-md">
            7th to 14th Oct
          </p>
        </div>

        {/* Primary tiles */}
        <div className="grid grid-cols-3 gap-3 px-4">
          {PRIMARY.map(({ id, label, sub, Icon, tint }) => (
            <button
              key={id}
              data-testid={`home-tile-${id}`}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 h-32 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">{label}</p>
                {sub && <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">{sub}</p>}
              </div>
              <div className={`self-end w-12 h-12 rounded-full flex items-center justify-center ${tint}`}>
                <Icon className="w-6 h-6" strokeWidth={1.8} />
              </div>
            </button>
          ))}
        </div>

        {/* Services grid */}
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className={`grid grid-cols-4 gap-y-5 gap-x-2 overflow-hidden transition-all ${expanded ? "max-h-96" : "max-h-24"}`}>
            {GRID.map(({ id, label, Icon }) => (
              <button
                key={id}
                data-testid={`home-service-${id}`}
                className="flex flex-col items-center gap-1.5 group"
              >
                <span className="text-[#005B9B] group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" strokeWidth={1.6} />
                </span>
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="w-14 h-7 rounded-full border border-slate-200 flex items-center justify-center text-[#005B9B] hover:bg-slate-50 transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Promo banner */}
        <div className="mx-4 mt-5 rounded-2xl overflow-hidden bg-gradient-to-r from-[#4C2A86] to-[#7A3FA0] p-5 relative">
          <p className="text-2xl font-black text-[#E7B85C] leading-none">TRAVEL SALE</p>
          <p className="text-xl font-black text-white leading-tight">IS LIVE NOW</p>
          <p className="mt-2 inline-block text-[10px] font-bold text-white bg-[#0B2E5C]/70 px-2 py-0.5 rounded">
            7th Oct to 14th Oct
          </p>
        </div>

        {/* Floating Alfred bubble + popup */}
        <div className="fixed md:absolute bottom-24 right-4 z-30 flex flex-col items-end gap-3">
          {showPopup && (
            <div
              data-testid="alfred-popup-card"
              className="relative w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 pr-8 animate-msg-in"
            >
              <button
                data-testid="alfred-popup-dismiss"
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex gap-2.5">
                <p className="text-xs leading-snug text-slate-700">
                  Meet Your Own Travel Assistant <span className="font-bold text-slate-900">"Alfred"</span>. Discover new destinations &amp; perfect itinerary.{" "}
                  <span className="font-bold text-[#FF6B00]">Try for FREE.</span>
                </p>
                <img src={ALFRED_AVATAR} alt="Alfred" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              </div>
            </div>
          )}
          <button
            data-testid="alfred-bubble"
            onClick={onOpenChat}
            className="w-16 h-16 rounded-full overflow-hidden shadow-2xl ring-4 ring-white hover:scale-105 active:scale-95 transition-transform animate-bubble-pulse"
          >
            <img src={ALFRED_AVATAR} alt="Open Alfred" className="w-full h-full object-cover" />
          </button>
        </div>

        {/* Bottom nav */}
        <nav className="fixed md:absolute bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-md bg-white border-t border-slate-200 px-4 py-2 flex items-end justify-between z-20">
          {NAV.map(({ id, label, Icon, active, center }) =>
            center ? (
              <div key={id} className="flex flex-col items-center -mt-6">
                <button
                  data-testid={`home-nav-${id}`}
                  className="w-14 h-14 rounded-full bg-gradient-to-b from-[#3AA0E8] to-[#0B6BB5] flex items-center justify-center shadow-lg shadow-sky-500/30"
                >
                  <Icon className="w-6 h-6 text-white" />
                </button>
                <span className="text-[10px] font-medium text-slate-500 mt-1">{label}</span>
              </div>
            ) : (
              <button
                key={id}
                data-testid={`home-nav-${id}`}
                className={`flex flex-col items-center gap-1 flex-1 ${active ? "text-[#005B9B]" : "text-slate-400"}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            )
          )}
        </nav>
      </div>
    </div>
  );
}
