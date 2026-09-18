import { useState, useRef, useCallback } from "react";
import "@/App.css";
import { Toaster, toast } from "sonner";
import Header from "./components/Header";
import ChatStream from "./components/ChatStream";
import BottomInputBar from "./components/BottomInputBar";
import ItineraryEditorModal from "./components/ItineraryEditorModal";
import SavedTripsDrawer from "./components/SavedTripsDrawer";
import MenuDrawer from "./components/MenuDrawer";
import {
  USER_NAME,
  DESTINATIONS,
  INTRO_CHIPS,
  DURATION_PLANS,
  FALLBACK_REPLIES,
  greeting,
  buildDays,
} from "./data/alfredData";

let idCounter = 0;
const nextId = () => `m-${++idCounter}-${Date.now()}`;

const introMessages = () => [
  { id: nextId(), type: "text", role: "ai", text: `${greeting()}, ${USER_NAME}` },
  {
    id: nextId(),
    type: "text",
    role: "ai",
    text: "I am here to help you find and book trips with your travel pals all in one place.",
  },
  {
    id: nextId(),
    type: "text",
    role: "ai",
    text: "Fret not! All our conversations are just for your eyes only.",
  },
  { id: nextId(), type: "chips", group: "intro", chips: INTRO_CHIPS.map((c) => ({ ...c, testId: `chip-${c.id === "inspire" ? "inspire-me" : c.id === "itinerary" ? "build-itinerary" : "help-booking"}` })) },
];

export default function App() {
  const [messages, setMessages] = useState(introMessages);
  const [stage, setStage] = useState("greeting");
  const [location, setLocation] = useState("Bengaluru");
  const [savedIds, setSavedIds] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const timers = useRef([]);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const push = useCallback((...msgs) => {
    setMessages((prev) => [...prev, ...msgs]);
  }, []);

  const replaceMessage = useCallback((id, msg) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? msg : m)));
  }, []);

  const showDestinations = useCallback(() => {
    const typingId = nextId();
    push({ id: typingId, type: "typing" });
    later(() => {
      replaceMessage(typingId, {
        id: typingId,
        type: "text",
        role: "ai",
        text: "Alright! How about we discover some fabulous destinations? Give me a sec to find your next getaway.",
      });
      const typing2 = nextId();
      later(() => push({ id: typing2, type: "typing" }), 500);
      later(() => {
        replaceMessage(typing2, {
          id: typing2,
          type: "carousel",
          destinations: DESTINATIONS,
        });
        push({
          id: nextId(),
          type: "text",
          role: "ai",
          text: "Which one of these sounds like your kind of chill? Or would you like more options?",
        });
        setStage("destinations");
      }, 1400);
    }, 900);
  }, [push, replaceMessage, later]);

  const askDuration = useCallback(
    (dest) => {
      const typingId = nextId();
      push({ id: typingId, type: "typing" });
      later(() => {
        replaceMessage(typingId, {
          id: typingId,
          type: "text",
          role: "ai",
          text: `Great choice, ${USER_NAME}!`,
        });
        push({
          id: nextId(),
          type: "text",
          role: "ai",
          text: "How many days are you thinking? Any specific activity in mind, or should I do some digging on your behalf?",
        });
        push({
          id: nextId(),
          type: "chips",
          group: "duration",
          chips: DURATION_PLANS.map((p) => ({ ...p, testId: `duration-chip-${p.id}` })),
        });
        setStage("duration");
      }, 800);
    },
    [push, replaceMessage, later]
  );

  const startBuild = useCallback(
    (dest, plan) => {
      const loadingId = nextId();
      push({
        id: loadingId,
        type: "loading",
        text: "Making your personalized itinerary... hang on, it will just take a few sec!",
      });
      setStage("building");
      later(() => {
        const days = buildDays(dest, plan.days);
        setItinerary({ destination: dest, plan, days });
        replaceMessage(loadingId, {
          id: loadingId,
          type: "summary",
          destination: dest,
          plan,
        });
        setStage("summary");
      }, 2000);
    },
    [push, replaceMessage, later]
  );

  const handleChip = useCallback(
    (chipId) => {
      const labels = {
        inspire: "Inspire me with my next destination",
        itinerary: "Build me an itinerary",
        booking: "Help me with booking",
      };
      push({ id: nextId(), type: "text", role: "user", text: labels[chipId] });
      if (chipId === "booking") {
        const typingId = nextId();
        later(() => push({ id: typingId, type: "typing" }), 300);
        later(() => {
          replaceMessage(typingId, {
            id: typingId,
            type: "text",
            role: "ai",
            text: "Happy to help with booking! First, let's lock a destination — tell me where you're headed, or tap 'Inspire me' and I'll shortlist some gems.",
          });
        }, 900);
        return;
      }
      showDestinations();
    },
    [push, replaceMessage, later, showDestinations]
  );

  const handleSend = useCallback(
    (text) => {
      push({ id: nextId(), type: "text", role: "user", text });
      if (stage === "greeting" || stage === "destinations") {
        showDestinations();
        return;
      }
      if (stage === "duration" && selectedDestination) {
        const dayMatch = text.match(/(\d+)\s*d/i);
        const days = dayMatch ? Math.min(Math.max(parseInt(dayMatch[1], 10), 1), 10) : 4;
        const plan = DURATION_PLANS.find((p) => p.days === days) || {
          id: "custom",
          label: text,
          days,
          theme: "Curated Explorers",
        };
        startBuild(selectedDestination, plan);
        return;
      }
      const typingId = nextId();
      later(() => push({ id: typingId, type: "typing" }), 300);
      later(() => {
        replaceMessage(typingId, {
          id: typingId,
          type: "text",
          role: "ai",
          text: FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)],
        });
      }, 800);
    },
    [stage, selectedDestination, push, replaceMessage, later, showDestinations, startBuild]
  );

  const handleSelectDestination = useCallback(
    (dest) => {
      if (stage === "building") return;
      setSelectedDestination(dest);
      push({ id: nextId(), type: "text", role: "user", text: `I would like to visit ${dest.name.split("—")[0].trim()}` });
      askDuration(dest);
    },
    [stage, push, askDuration]
  );

  const handlePickDuration = useCallback(
    (plan) => {
      if (!selectedDestination || stage !== "duration") return;
      push({ id: nextId(), type: "text", role: "user", text: plan.label });
      startBuild(selectedDestination, plan);
    },
    [selectedDestination, stage, push, startBuild]
  );

  const handleSaveDestination = useCallback((dest) => {
    setSavedIds((prev) => {
      if (prev.includes(dest.id)) {
        toast.success(`${dest.name.split("—")[0].trim()} removed from saved trips`);
        return prev.filter((x) => x !== dest.id);
      }
      toast.success(`${dest.name.split("—")[0].trim()} saved to your list`);
      return [...prev, dest.id];
    });
  }, []);

  const handleShareDestination = useCallback((dest) => {
    const link = `${window.location.origin}/trip/${dest.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    toast.success(`Share link copied for ${dest.name.split("—")[0].trim()}`);
  }, []);

  const handleOpenItinerary = useCallback(
    (summaryMsg) => {
      if (!itinerary) {
        setItinerary({
          destination: summaryMsg.destination,
          plan: summaryMsg.plan,
          days: buildDays(summaryMsg.destination, summaryMsg.plan.days),
        });
      }
      setEditorOpen(true);
    },
    [itinerary]
  );

  const handleNewChat = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setMessages(introMessages());
    setStage("greeting");
    setSelectedDestination(null);
    setItinerary(null);
    setEditorOpen(false);
    setFeedback(null);
    toast.success("Started a fresh chat with Alfred");
  }, []);

  const handleFeedback = useCallback(
    (dir) => {
      setFeedback((prev) => (prev === dir ? null : dir));
      if (feedback !== dir) {
        toast.success(dir === "up" ? "Thanks! Glad Alfred could help." : "Thanks for the feedback — Alfred will do better.");
      }
    },
    [feedback]
  );

  const savedDestinations = DESTINATIONS.filter((d) => savedIds.includes(d.id));

  return (
    <div className="min-h-screen md:min-h-0 md:h-screen w-full bg-slate-200/60 md:flex md:items-center md:justify-center md:py-6">
      <div className="w-full h-[100dvh] md:h-[calc(100vh-3rem)] md:max-w-2xl md:rounded-3xl md:border md:border-slate-200 md:shadow-2xl bg-[#F4F7FA] flex flex-col overflow-hidden">
        <Header
          location={location}
          onLocationChange={setLocation}
          savedCount={savedIds.length}
          onOpenSaved={() => setSavedOpen(true)}
          onNewChat={handleNewChat}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <ChatStream
          messages={messages}
          savedIds={savedIds}
          onChip={handleChip}
          onSelectDestination={handleSelectDestination}
          onSaveDestination={handleSaveDestination}
          onShareDestination={handleShareDestination}
          onPickDuration={handlePickDuration}
          onOpenItinerary={handleOpenItinerary}
        />
        <BottomInputBar onSend={handleSend} onFeedback={handleFeedback} feedback={feedback} />
      </div>

      {editorOpen && itinerary && (
        <ItineraryEditorModal
          itinerary={itinerary}
          saved={savedIds.includes(itinerary.destination.id)}
          onClose={() => setEditorOpen(false)}
          onUpdateDays={(days) => setItinerary((prev) => ({ ...prev, days }))}
          onSave={() => handleSaveDestination(itinerary.destination)}
          onShare={() => handleShareDestination(itinerary.destination)}
        />
      )}
      <SavedTripsDrawer
        open={savedOpen}
        savedDestinations={savedDestinations}
        onClose={() => setSavedOpen(false)}
        onRemove={handleSaveDestination}
        onPlan={(d) => {
          setSavedOpen(false);
          handleSelectDestination(d);
        }}
      />
      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onAction={(label) => {
          setMenuOpen(false);
          if (label === "Saved Trips") setSavedOpen(true);
          else toast.info(`${label} is coming soon in the live version!`);
        }}
      />
      <Toaster position="top-center" richColors />
    </div>
  );
}
