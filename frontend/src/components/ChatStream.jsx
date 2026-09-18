import { useEffect, useRef } from "react";
import { Bot, Link2 } from "lucide-react";
import DestinationCarousel from "./DestinationCarousel";
import ItinerarySummaryCard from "./ItinerarySummaryCard";
import HotelOptions from "./HotelOptions";
import BookingForm from "./BookingForm";

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="typing-dot" />
      <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
      <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
    </span>
  );
}

export default function ChatStream({
  messages,
  savedIds,
  onChipAction,
  onSelectDestination,
  onSaveDestination,
  onShareDestination,
  onOpenItinerary,
  onSelectHotel,
  onBookFlight,
  onFormSubmit,
  onDownload,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <main
      data-testid="chat-stream-container"
      className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-3"
    >
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
        <Bot className="w-3.5 h-3.5" /> Powered by OpenAI
      </div>

      {messages.map((m) => {
        if (m.type === "text") {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              data-testid={isUser ? "chat-user-message" : "chat-ai-message"}
              className={`flex ${isUser ? "justify-end" : "justify-start"} animate-msg-in`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${
                  isUser
                    ? "bg-[#005B9B] text-white rounded-br-md shadow-md shadow-sky-900/15"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        }

        if (m.type === "typing") {
          return (
            <div key={m.id} data-testid="alfred-typing-indicator" className="flex justify-start animate-msg-in">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 shadow-sm">
                <TypingDots />
              </div>
            </div>
          );
        }

        if (m.type === "loading") {
          return (
            <div key={m.id} data-testid="itinerary-loading-message" className="flex justify-start animate-msg-in">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <p className="text-sm text-slate-800 leading-relaxed">{m.text}</p>
                <TypingDots />
              </div>
            </div>
          );
        }

        if (m.type === "chips") {
          return (
            <div key={m.id} data-testid={`chip-group-${m.group}`} className="flex flex-wrap gap-2 animate-msg-in">
              {m.chips.map((c) => (
                <button
                  key={c.id}
                  data-testid={c.testId}
                  onClick={() => onChipAction(m.group, c)}
                  className="text-xs font-semibold text-amber-900 bg-amber-50 border-2 border-amber-400/70 rounded-xl px-3.5 py-2 hover:bg-amber-100 hover:border-amber-500 hover:-translate-y-0.5 transition-all"
                >
                  {c.label}
                </button>
              ))}
            </div>
          );
        }

        if (m.type === "carousel") {
          return (
            <div key={m.id} className="animate-msg-in">
              <DestinationCarousel
                destinations={m.destinations}
                savedIds={savedIds}
                onSelect={onSelectDestination}
                onSave={onSaveDestination}
                onShare={onShareDestination}
              />
            </div>
          );
        }

        if (m.type === "summary") {
          return (
            <div key={m.id} className="flex justify-start animate-msg-in">
              <ItinerarySummaryCard
                destination={m.destination}
                plan={m.plan}
                saved={savedIds.includes(m.destination.id)}
                onOpen={() => onOpenItinerary(m)}
                onSave={() => onSaveDestination(m.destination)}
                onShare={() => onShareDestination(m.destination)}
              />
            </div>
          );
        }

        if (m.type === "hotels") {
          return (
            <div key={m.id} className="animate-msg-in">
              <HotelOptions
                flightLabel={m.flightLabel}
                flightPriceLabel={m.flightPriceLabel}
                hotels={m.hotels}
                onSelectHotel={onSelectHotel}
                onBookFlight={onBookFlight}
              />
            </div>
          );
        }

        if (m.type === "form") {
          return (
            <div key={m.id} className="flex justify-start animate-msg-in">
              <BookingForm step={m.step} onSubmit={(data) => onFormSubmit(m.step, data)} />
            </div>
          );
        }

        if (m.type === "success") {
          return (
            <div key={m.id} data-testid="booking-success-message" className="flex justify-start animate-msg-in">
              <div className="max-w-[85%] bg-emerald-50 border border-emerald-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <p className="text-sm font-bold text-emerald-700">
                  Congratulations! Your flight & hotel are confirmed.
                </p>
                <p className="text-sm text-slate-700 mt-1">Check your email for the details.</p>
                <p data-testid="booking-reference" className="text-xs font-semibold text-slate-500 mt-1">
                  Booking Ref: {m.ref}
                </p>
                <button
                  data-testid="booking-download-link"
                  onClick={onDownload}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#005B9B] hover:underline"
                >
                  <Link2 className="w-4 h-4" /> Click to Download Here
                </button>
              </div>
            </div>
          );
        }

        return null;
      })}
      <div ref={endRef} />
    </main>
  );
}
