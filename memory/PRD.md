# PRD — Alfred: EaseMyTrip AI Travel Assistant

## Original Problem Statement
Responsive web app for 'Alfred', an AI travel assistant chat interface for EaseMyTrip. Genuinely responsive single-page layout (desktop: centered ~600px chat column; mobile: full-width) via CSS breakpoints. Header with back+Alfred title, Bengaluru location dropdown, hamburger + profile thumbnail, heart (saved) and pencil (new chat) icons. Scripted greeting flow with 3 chips (Inspire me where to go / Build me an itinerary / Help me with booking), destination cards carousel with category tags and Save/Share, itinerary summary card, day-by-day itinerary editor with draggable stops (Breakfast, Place 1-3, Lunch, Dinner), Add More/Add Day, persistent 'Ask me anything' input bar with thumbs up/down. React + Tailwind, fully scripted (no API calls), all state in useState, no backend.

## User Personas
- Leisure traveller (Miss Tanwar persona) exploring trips from Bengaluru via chat
- Deal-seeker comparing destinations and saving shortlists
- Itinerary planner who wants to fine-tune day-by-day schedules

## Architecture
- Frontend-only React 19 + Tailwind + lucide-react + sonner (no backend, no API calls)
- Scripted conversation state machine in `src/App.js` (stages: greeting → destinations → duration → building → summary)
- Data & scripted content in `src/data/alfredData.js` (3 destinations: Goa/Jaipur/Kerala, duration plans, day generator)
- Components: Header, ChatStream, DestinationCarousel, ItinerarySummaryCard, ItineraryEditorModal, SavedTripsDrawer, MenuDrawer, BottomInputBar
- HTML5 drag-and-drop for stop reordering; timers cleaned up on new chat

## Implemented (2026-09-18)- Responsive chat shell (100dvh mobile, max-w-2xl centered card desktop)
- Two-row header: back+Alfred, city dropdown (5 cities), hamburger menu drawer, profile avatar, saved heart with badge, new-chat pencil
- Scripted greeting + privacy note + 3 intro chips
- Typing indicators, destination carousel (snap-x) with Adventure/Culture/Relaxation tags, Save/Share
- Duration chips (4D/5D/7D) + free-text "4D" parsing
- Loading message → itinerary summary card → full editor modal
- Editor: vertical day tabs, draggable stop rows, Add More, Add Day, hotel deals chip, Book CTA, Map View stub
- Saved trips drawer, menu drawer, feedback thumbs, toasts
- E2E tested: 46/46 assertions passed (testing iteration_1)
- Booking flow (iteration_2, 28/28 passed): flight intent detection ('book my flight...') → date chips/free-text → budget parsing (₹ lakh/k) → flight deal card (Check & Book Now / Book Here) + 2 hotel cards per destination (rating, ₹/night, Open/Save/Select) → total cost summary (Sounds Okay/Modify, Modify loops to dates/budget/hotel) → date confirm → traveller form (gender/name/age) → contact form with simulated autofill → seat pre-book chips → confirming loading → success message + mock download link
- Post-booking support: update/modify intent → 'What seems to be wrong?' → correction accepted (email regex extraction) → toll-free 1800-419-4646 + cab pickup offer chips
- (iteration_3) Editor 'Book this trip on EaseMyTrip' button wired into the real booking flow (closes modal, posts user message, starts dates→budget→hotels conversation) — no longer a toast dead-end; booking success now shows mock Booking Ref (EMT-######) alongside download link; both typed booking messages and the editor button lead into the same flow

## Backlog
- P0: Wire real LLM (Emergent LLM key) to replace scripted responses
- P1: Backend persistence for saved trips & itineraries (MongoDB), user auth
- P1: Real booking deep-links to EaseMyTrip, hotel deals data
- P2: Map view with real map, shareable itinerary links, voice input, Escape-key drawer close

## Next Tasks
- (iteration_4) Added EaseMyTrip HOME screen entry point (HomeScreen.jsx) with Flights/Hotels/Trains tiles, services grid, promo banner, bottom nav, and floating Alfred bubble + intro popup card; tapping bubble opens chat as full-screen overlay, header back button returns home
- Added Solo/Couple/Group travel-party personalization chips between destination selection and duration
- Redesigned hamburger slide-out menu: profile name, Saved List, New Chat, chat history grouped Today/Yesterday
- Fixed booking: replaced date chips with a real calendar date-range picker (react-day-picker); hardened budget field isolation on Modify→Hotel (functional setBooking snapshot, budget never mutates); contact-form autofill now derives email from the traveller name just entered (emailFromName)
- All verified via testing iteration_4 (100%)
1. Confirm UX with stakeholder, then integrate live AI via Emergent LLM key
2. Add backend persistence when moving beyond demo
