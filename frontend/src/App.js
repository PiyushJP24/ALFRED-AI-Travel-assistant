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
  HOTELS,
  greeting,
  buildDays,
  formatINR,
  parseBudget,
  flightPrice,
} from "./data/alfredData";

let idCounter = 0;
const nextId = () => `m-${++idCounter}-${Date.now()}`;

const destShort = (d) => d.name.split("—")[0].trim();
const hotelsFor = (dest) => HOTELS[dest.id] || HOTELS.default;

const DATE_CHIPS = [
  { id: "last-week", label: "Last week", testId: "booking-date-chip-last-week" },
  { id: "12-15", label: "12 - 15 Dec", testId: "booking-date-chip-12-15" },
];
const COST_CHIPS = [
  { id: "okay", label: "Sounds Okay", testId: "booking-chip-sounds-okay" },
  { id: "modify", label: "Modify", testId: "booking-chip-modify" },
];
const DATES_CONFIRM_CHIPS = [
  { id: "okay", label: "Okay", testId: "booking-chip-okay" },
  { id: "modify", label: "Modify", testId: "booking-chip-modify-dates" },
];
const MODIFY_CHIPS = [
  { id: "dates", label: "Dates", testId: "modify-chip-dates" },
  { id: "budget", label: "Budget", testId: "modify-chip-budget" },
  { id: "hotel", label: "Hotel", testId: "modify-chip-hotel" },
];
const SEAT_CHIPS = [
  { id: "yes", label: "Yes, Sounds Great", testId: "seat-chip-yes" },
  { id: "no", label: "No, I will do it later", testId: "seat-chip-no" },
];
const CAB_CHIPS = [
  { id: "yes", label: "Yes, please", testId: "cab-chip-yes" },
  { id: "no", label: "No, Thanks. That would be all.", testId: "cab-chip-no" },
];

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
  const [booking, setBooking] = useState(null);
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

  const startBooking = useCallback(() => {
    const dest = selectedDestination || DESTINATIONS[0];
    const plan = itinerary?.plan || DURATION_PLANS[0];
    setBooking({ destination: dest, plan, dates: null, budget: null, hotel: null, total: null, traveller: null, contact: null });
    const typingId = nextId();
    push({ id: typingId, type: "typing" });
    later(() => {
      replaceMessage(typingId, {
        id: typingId,
        type: "text",
        role: "ai",
        text: itinerary
          ? `I can see you have added an itinerary for this trip. Are you sure about the ${plan.days} days trip? Any specific dates in December?`
          : `Great! Let's get you booked on ${dest.name}. Any specific dates in mind?`,
      });
      push({ id: nextId(), type: "chips", group: "booking-dates", chips: DATE_CHIPS });
      setStage("booking-dates");
    }, 900);
  }, [selectedDestination, itinerary, push, replaceMessage, later]);

  const handleBookingDate = useCallback(
    (chip) => {
      if (!booking) return;
      const dates = chip.id === "last-week" ? "26 - 29 Dec" : chip.id === "12-15" ? "12 - 15 Dec" : chip.label;
      setBooking((b) => ({ ...b, dates }));
      push({ id: nextId(), type: "text", role: "user", text: chip.label });
      const typingId = nextId();
      later(() => push({ id: typingId, type: "typing" }), 300);
      later(() => {
        replaceMessage(typingId, {
          id: typingId,
          type: "text",
          role: "ai",
          text: `Perfect! So, for ${booking.plan.days}D/${booking.plan.days - 1}N stay in ${destShort(booking.destination)}; is there any budget in your mind?`,
        });
        setStage("booking-budget");
      }, 900);
    },
    [booking, push, replaceMessage, later]
  );

  const handleBudgetText = useCallback(
    (text) => {
      if (!booking) return;
      const budget = parseBudget(text);
      setBooking((b) => ({ ...b, budget }));
      const budgetTxt = budget ? ` under ${formatINR(budget)}` : "";
      push({
        id: nextId(),
        type: "text",
        role: "ai",
        text: `Perfect! So, for ${booking.plan.days}D/${booking.plan.days - 1}N stay${budgetTxt} in ${destShort(booking.destination)} — let me find some good flight & hotel options. Give me a moment!`,
      });
      later(() => push({ id: nextId(), type: "text", role: "ai", text: "Just a sec, finding the best flight & stay for you" }), 800);
      later(() => {
        push({
          id: nextId(),
          type: "hotels",
          flightLabel: "AA (Round)",
          flightPriceLabel: formatINR(flightPrice(booking.destination) * 2),
          hotels: hotelsFor(booking.destination),
        });
        setStage("booking-options");
      }, 1800);
    },
    [booking, push, later]
  );

  const handleSelectHotel = useCallback(
    (hotel) => {
      if (!booking) return;
      const nights = booking.plan.days - 1;
      const total = flightPrice(booking.destination) * 2 + hotel.pricePerNight * nights;
      setBooking((b) => ({ ...b, hotel, total }));
      push({ id: nextId(), type: "text", role: "user", text: `Flight: AA (Round), ${hotel.name} (${booking.plan.days} days)` });
      const typingId = nextId();
      later(() => push({ id: typingId, type: "typing" }), 300);
      later(() => {
        replaceMessage(typingId, {
          id: typingId,
          type: "text",
          role: "ai",
          text: `Basis your selection the total cost comes to ${formatINR(total)}. Is everything okay? Proceed?`,
        });
        push({ id: nextId(), type: "chips", group: "booking-cost", chips: COST_CHIPS });
        setStage("booking-cost");
      }, 900);
    },
    [booking, push, replaceMessage, later]
  );

  const modifyOptions = useCallback(() => {
    const typingId = nextId();
    push({ id: typingId, type: "typing" });
    later(() => {
      replaceMessage(typingId, { id: typingId, type: "text", role: "ai", text: "No worries! What would you like to change?" });
      push({ id: nextId(), type: "chips", group: "booking-modify", chips: MODIFY_CHIPS });
      setStage("booking-modify");
    }, 700);
  }, [push, replaceMessage, later]);

  const handleConfirmCost = useCallback(
    (ok) => {
      if (!booking?.hotel) return;
      push({ id: nextId(), type: "text", role: "user", text: ok ? "Sounds Okay" : "Modify" });
      if (!ok) {
        modifyOptions();
        return;
      }
      const typingId = nextId();
      push({ id: typingId, type: "typing" });
      later(() => {
        replaceMessage(typingId, {
          id: typingId,
          type: "text",
          role: "ai",
          text: `Can you confirm your dates? Flight: AA (${booking.dates}) & ${booking.hotel.name} (${booking.dates}). Sounds all okay?`,
        });
        push({ id: nextId(), type: "chips", group: "booking-dates-confirm", chips: DATES_CONFIRM_CHIPS });
        setStage("booking-dates-confirm");
      }, 900);
    },
    [booking, push, replaceMessage, later, modifyOptions]
  );

  const handleDatesConfirm = useCallback(
    (ok) => {
      push({ id: nextId(), type: "text", role: "user", text: ok ? "Okay" : "Modify" });
      if (!ok) {
        modifyOptions();
        return;
      }
      const typingId = nextId();
      push({ id: typingId, type: "typing" });
      later(() => {
        replaceMessage(typingId, { id: typingId, type: "text", role: "ai", text: "Help me with your Gender, Name & Age" });
        push({ id: nextId(), type: "form", step: "traveller" });
        setStage("booking-form1");
      }, 900);
    },
    [push, replaceMessage, later, modifyOptions]
  );

  const handleModifyChoice = useCallback(
    (chip) => {
      if (!booking) return;
      push({ id: nextId(), type: "text", role: "user", text: chip.label });
      const typingId = nextId();
      push({ id: typingId, type: "typing" });
      later(() => {
        if (chip.id === "dates") {
          replaceMessage(typingId, { id: typingId, type: "text", role: "ai", text: "Sure thing! Pick your new dates." });
          push({ id: nextId(), type: "chips", group: "booking-dates", chips: DATE_CHIPS });
          setStage("booking-dates");
        } else if (chip.id === "budget") {
          replaceMessage(typingId, { id: typingId, type: "text", role: "ai", text: "Got it! What's your updated budget?" });
          setStage("booking-budget");
        } else {
          replaceMessage(typingId, { id: typingId, type: "text", role: "ai", text: "Here are the hotel options again — take your pick." });
          push({
            id: nextId(),
            type: "hotels",
            flightLabel: "AA (Round)",
            flightPriceLabel: formatINR(flightPrice(booking.destination) * 2),
            hotels: hotelsFor(booking.destination),
          });
          setStage("booking-options");
        }
      }, 700);
    },
    [booking, push, replaceMessage, later]
  );

  const handleTravellerSubmit = useCallback(
    (data) => {
      setBooking((b) => (b ? { ...b, traveller: data } : b));
      push({ id: nextId(), type: "text", role: "user", text: `${data.gender}, ${data.name}, ${data.age}` });
      const typingId = nextId();
      push({ id: typingId, type: "typing" });
      later(() => {
        replaceMessage(typingId, { id: typingId, type: "text", role: "ai", text: "Help me with your Phone & Email Acc" });
        push({ id: nextId(), type: "form", step: "contact" });
        setStage("booking-form2");
      }, 900);
    },
    [push, replaceMessage, later]
  );

  const handleContactSubmit = useCallback(
    (data) => {
      setBooking((b) => (b ? { ...b, contact: data } : b));
      push({ id: nextId(), type: "text", role: "user", text: `${data.phone}, ${data.email}` });
      const typingId = nextId();
      push({ id: typingId, type: "typing" });
      later(() => {
        replaceMessage(typingId, { id: typingId, type: "text", role: "ai", text: "Would you like to pre-book the seat?" });
        push({ id: nextId(), type: "chips", group: "booking-seat", chips: SEAT_CHIPS });
        setStage("booking-seat");
      }, 900);
    },
    [push, replaceMessage, later]
  );

  const handleSeatChoice = useCallback(
    (chip) => {
      push({ id: nextId(), type: "text", role: "user", text: chip.label });
      const loadingId = nextId();
      later(() => {
        push({
          id: loadingId,
          type: "loading",
          text: "It might take a few sec, I am confirming the booking for your selected dates",
        });
        setStage("booking-confirming");
      }, 400);
      later(() => {
        replaceMessage(loadingId, {
          id: loadingId,
          type: "success",
          ref: `EMT-${Math.floor(100000 + Math.random() * 900000)}`,
        });
        setStage("booked");
      }, 2400);
    },
    [push, replaceMessage, later]
  );

  const startSupport = useCallback(() => {
    const typingId = nextId();
    push({ id: typingId, type: "typing" });
    later(() => {
      replaceMessage(typingId, { id: typingId, type: "text", role: "ai", text: "What seems to be wrong? Let me know." });
      setStage("support-issue");
    }, 700);
  }, [push, replaceMessage, later]);

  const handleCorrection = useCallback(
    (text) => {
      const email = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
      push({ id: nextId(), type: "text", role: "ai", text: "Aw! Let me see what can be done here." });
      later(() => {
        push({
          id: nextId(),
          type: "text",
          role: "ai",
          text: email ? `Done! Your email is updated to ${email[0]}.` : "Noted! I've passed the correction to our bookings team.",
        });
        push({
          id: nextId(),
          type: "text",
          role: "ai",
          text: "If anything else comes up, here is the Toll Free No: 1800-419-4646. Call between 10am-5pm. Would you like me to book a cab pickup?",
        });
        push({ id: nextId(), type: "chips", group: "cab-offer", chips: CAB_CHIPS });
        setStage("cab-offer");
      }, 900);
    },
    [push, later]
  );

  const handleCabChoice = useCallback(
    (chip) => {
      push({ id: nextId(), type: "text", role: "user", text: chip.label });
      const typingId = nextId();
      push({ id: typingId, type: "typing" });
      later(() => {
        replaceMessage(typingId, {
          id: typingId,
          type: "text",
          role: "ai",
          text:
            chip.id === "yes"
              ? "Done! Cab pickup is booked for your arrival. Have a wonderful trip!"
              : "No problem! Wishing you a fantastic trip — ping me anytime!",
        });
        setStage("booked");
      }, 800);
    },
    [push, replaceMessage, later]
  );

  const fallbackReply = useCallback(() => {
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
  }, [push, replaceMessage, later]);

  const handleChip = useCallback(
    (chipId) => {
      const labels = {
        inspire: "Inspire me with my next destination",
        itinerary: "Build me an itinerary",
        booking: "Help me with booking",
      };
      push({ id: nextId(), type: "text", role: "user", text: labels[chipId] });
      if (chipId === "booking") {
        startBooking();
        return;
      }
      showDestinations();
    },
    [push, showDestinations, startBooking]
  );

  const handleSend = useCallback(
    (text) => {
      push({ id: nextId(), type: "text", role: "user", text });

      if (stage === "support-issue") {
        handleCorrection(text);
        return;
      }

      if (stage === "cab-offer") {
        if (/no|thanks|later|nope/i.test(text)) handleCabChoice(CAB_CHIPS[1]);
        else if (/yes|sure|ok/i.test(text)) handleCabChoice(CAB_CHIPS[0]);
        else fallbackReply();
        return;
      }

      if (stage === "booked" && /update|modify|change|wrong|email|edit/i.test(text)) {
        startSupport();
        return;
      }

      if (stage === "booking-dates" && booking) {
        handleBookingDate({ id: "custom", label: text });
        return;
      }

      if (stage === "booking-budget" && booking) {
        handleBudgetText(text);
        return;
      }

      const inBooking = stage.startsWith("booking");
      if (!inBooking && stage !== "booked" && /book|flight|fly/i.test(text)) {
        startBooking();
        return;
      }

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
      fallbackReply();
    },
    [
      stage,
      selectedDestination,
      booking,
      push,
      showDestinations,
      startBuild,
      startBooking,
      handleBookingDate,
      handleBudgetText,
      handleCorrection,
      startSupport,
      handleCabChoice,
      fallbackReply,
    ]
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

  const handleChipAction = useCallback(
    (group, chip) => {
      if (group === "intro") return handleChip(chip.id);
      if (group === "duration") return handlePickDuration(chip);
      if (group === "booking-dates") return handleBookingDate(chip);
      if (group === "booking-cost") return handleConfirmCost(chip.id === "okay");
      if (group === "booking-dates-confirm") return handleDatesConfirm(chip.id === "okay");
      if (group === "booking-modify") return handleModifyChoice(chip);
      if (group === "booking-seat") return handleSeatChoice(chip);
      if (group === "cab-offer") return handleCabChoice(chip);
      return undefined;
    },
    [handleChip, handlePickDuration, handleBookingDate, handleConfirmCost, handleDatesConfirm, handleModifyChoice, handleSeatChoice, handleCabChoice]
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
    setBooking(null);
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

  const handleBookFlight = useCallback(() => {
    if (!booking) return;
    handleSelectHotel(hotelsFor(booking.destination)[0]);
  }, [booking, handleSelectHotel]);

  const handleBookFromEditor = useCallback(() => {
    setEditorOpen(false);
    push({ id: nextId(), type: "text", role: "user", text: "Book this trip on EaseMyTrip" });
    startBooking();
  }, [push, startBooking]);

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
          onChipAction={handleChipAction}
          onSelectDestination={handleSelectDestination}
          onSaveDestination={handleSaveDestination}
          onShareDestination={handleShareDestination}
          onOpenItinerary={handleOpenItinerary}
          onSelectHotel={handleSelectHotel}
          onBookFlight={handleBookFlight}
          onFormSubmit={(step, data) => (step === "traveller" ? handleTravellerSubmit(data) : handleContactSubmit(data))}
          onDownload={() => toast.success("Your trip invoice is downloading (demo link)")}
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
          onBook={handleBookFromEditor}
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
