import { useState } from "react";
import { Send, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";

export default function BottomInputBar({ onSend, onFeedback, feedback }) {
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  };

  return (
    <div className="shrink-0 bg-white border-t border-slate-200 px-3 sm:px-4 pt-2.5 pb-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 focus-within:border-[#005B9B] focus-within:ring-2 focus-within:ring-[#005B9B]/15 transition-all">
          <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0" />
          <input
            data-testid="chat-input-field"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ask me anything"
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
          />
        </div>
        <button
          data-testid="chat-send-button"
          onClick={submit}
          className="p-2.5 rounded-full bg-[#005B9B] text-white hover:bg-[#004C8F] transition-colors shadow-md shadow-sky-900/20"
        >
          <Send className="w-4 h-4" />
        </button>
        <button
          data-testid="feedback-thumbs-up-button"
          onClick={() => onFeedback("up")}
          className={`p-2 rounded-full transition-colors ${
            feedback === "up"
              ? "bg-emerald-100 text-emerald-600"
              : "text-slate-400 hover:text-emerald-600 hover:bg-slate-100"
          }`}
        >
          <ThumbsUp className="w-4.5 h-4.5 w-5 h-5" />
        </button>
        <button
          data-testid="feedback-thumbs-down-button"
          onClick={() => onFeedback("down")}
          className={`p-2 rounded-full transition-colors ${
            feedback === "down"
              ? "bg-rose-100 text-rose-500"
              : "text-slate-400 hover:text-rose-500 hover:bg-slate-100"
          }`}
        >
          <ThumbsDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
