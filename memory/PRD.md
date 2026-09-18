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

## Implemented (2026-09-18)
- Responsive chat shell (100dvh mobile, max-w-2xl centered card desktop)
- Two-row header: back+Alfred, city dropdown (5 cities), hamburger menu drawer, profile avatar, saved heart with badge, new-chat pencil
- Scripted greeting + privacy note + 3 intro chips
- Typing indicators, destination carousel (snap-x) with Adventure/Culture/Relaxation tags, Save/Share
- Duration chips (4D/5D/7D) + free-text "4D" parsing
- Loading message → itinerary summary card → full editor modal
- Editor: vertical day tabs, draggable stop rows, Add More, Add Day, hotel deals chip, Book CTA, Map View stub
- Saved trips drawer, menu drawer, feedback thumbs, toasts
- E2E tested: 46/46 assertions passed (testing iteration_1)

## Backlog
- P0: Wire real LLM (Emergent LLM key) to replace scripted responses
- P1: Backend persistence for saved trips & itineraries (MongoDB), user auth
- P1: Real booking deep-links to EaseMyTrip, hotel deals data
- P2: Map view with real map, shareable itinerary links, voice input, Escape-key drawer close

## Next Tasks
1. Confirm UX with stakeholder, then integrate live AI via Emergent LLM key
2. Add backend persistence when moving beyond demo
