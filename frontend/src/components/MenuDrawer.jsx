import { X, Heart, PenSquare, MessageSquare, User } from "lucide-react";
import { AVATAR_URL, USER_NAME, CHAT_HISTORY } from "../data/alfredData";

export default function MenuDrawer({ open, onClose, onNewChat, onOpenSaved, onSelectHistory }) {
  if (!open) return null;
  return (
    <div
      data-testid="menu-drawer"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-full max-w-[300px] bg-white shadow-2xl flex flex-col animate-slide-in-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end px-3 py-3">
          <button
            data-testid="menu-close-button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4">
          <button
            data-testid="menu-profile"
            className="w-full flex items-center gap-3 py-2"
          >
            <img
              src={AVATAR_URL}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00A4D5]/40"
            />
            <span className="text-base font-bold text-slate-900">{USER_NAME}</span>
          </button>
        </div>

        <nav className="px-3 py-2">
          <button
            data-testid="menu-saved-list"
            onClick={onOpenSaved}
            className="w-full flex items-center gap-3 px-2 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#FF6B00] transition-colors"
          >
            <Heart className="w-5 h-5 text-[#FF6B00]" /> Saved List
          </button>
          <button
            data-testid="menu-new-chat"
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-2 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005B9B] transition-colors"
          >
            <PenSquare className="w-5 h-5 text-[#005B9B]" /> New Chat
          </button>
        </nav>

        <div className="border-t border-slate-100 mx-4" />

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {CHAT_HISTORY.map((group) => (
            <div key={group.section}>
              <p className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {group.section}
              </p>
              <div className="mt-1 space-y-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    data-testid={`menu-history-${item.id}`}
                    onClick={() => onSelectHistory(item)}
                    className="w-full flex items-center gap-2.5 px-2 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#005B9B] transition-colors text-left"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
