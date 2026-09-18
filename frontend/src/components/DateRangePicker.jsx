import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Calendar } from "./ui/calendar";

export default function DateRangePicker({ onConfirm }) {
  const [range, setRange] = useState();
  const ready = range?.from && range?.to;
  const label = ready
    ? `${format(range.from, "d MMM")} - ${format(range.to, "d MMM")}`
    : range?.from
    ? `${format(range.from, "d MMM")} - …`
    : "Select your travel dates";

  return (
    <div
      data-testid="booking-date-picker"
      className="w-[300px] bg-white border border-slate-200 rounded-2xl p-2 shadow-sm"
    >
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
        disabled={{ before: new Date() }}
      />
      <div className="flex items-center gap-1.5 px-2 pb-2 text-xs font-medium text-slate-600">
        <CalendarDays className="w-3.5 h-3.5 text-[#FF6B00]" />
        <span data-testid="booking-date-picker-label">{label}</span>
      </div>
      <button
        data-testid="booking-date-confirm"
        disabled={!ready}
        onClick={() => onConfirm(label)}
        className="w-full bg-[#005B9B] hover:bg-[#004C8F] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-2 rounded-xl transition-colors"
      >
        Confirm Dates
      </button>
    </div>
  );
}
