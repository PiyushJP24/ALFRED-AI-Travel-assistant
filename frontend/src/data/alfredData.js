export const USER_NAME = "Miss Tanwar";

export const AVATAR_URL =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";

export const CITIES = ["Bengaluru", "Delhi", "Mumbai", "Hyderabad", "Chennai"];

export const DESTINATIONS = [
  {
    id: "goa",
    name: "Goa — Tropical Paradise",
    tag: "Adventure",
    image:
      "https://images.pexels.com/photos/15827754/pexels-photo-15827754.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    dates: "12 – 16 Oct",
    flight: "₹4,320 flight · 1h 15m from BLR",
    blurb: "Palm-lined beaches, water sports and susegad evenings.",
    places: [
      "Baga Beach Sunrise Walk",
      "Fort Aguada",
      "Anjuna Flea Market",
      "Basilica of Bom Jesus",
      "Palolem Beach Sunset",
      "Dudhsagar Falls Trip",
      "Chapora Fort",
      "Candolim Beach Shacks",
      "Old Goa Heritage Walk",
      "Mandovi River Cruise",
      "Arambol Sweet Water Lake",
      "Spice Plantation Tour",
      "Scuba at Grande Island",
      "Fontainhas Latin Quarter",
    ],
    eats: ["Café Tinto", "Fisherman's Wharf", "Thalassa", "Gunpowder", "Curlies Beach Shack", "Vinayak Family Restaurant"],
  },
  {
    id: "jaipur",
    name: "Jaipur — Cultural Heritage",
    tag: "Culture",
    image:
      "https://images.unsplash.com/photo-1504705759706-c5ee7158f8bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxqYWlwdXIlMjBwYWxhY2UlMjBpbmRpYSUyMGhlcml0YWdlfGVufDB8fHx8MTc4OTcyODk4OXww&ixlib=rb-4.1.0&q=85",
    dates: "20 – 24 Oct",
    flight: "₹5,180 flight · 2h 25m from BLR",
    blurb: "Pink City palaces, royal forts and bazaar trails.",
    places: [
      "Amber Fort",
      "Hawa Mahal",
      "City Palace",
      "Jantar Mantar",
      "Nahargarh Fort Sunset",
      "Jal Mahal",
      "Johari Bazaar",
      "Albert Hall Museum",
      "Bapu Bazaar",
      "Patrika Gate",
      "Galtaji Monkey Temple",
      "Stepwell Panna Meena",
    ],
    eats: ["Laxmi Misthan Bhandar", "Chokhi Dhani", "Tapri Central", "Rawat Kachori", "Peacock Rooftop"],
  },
  {
    id: "kerala",
    name: "Kerala — Backwater Bliss",
    tag: "Relaxation",
    image:
      "https://images.pexels.com/photos/12950219/pexels-photo-12950219.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    dates: "02 – 06 Nov",
    flight: "₹3,940 flight · 1h 05m from BLR",
    blurb: "Emerald backwaters, houseboats and misty tea hills.",
    places: [
      "Alleppey Houseboat Cruise",
      "Vembanad Lake",
      "Munnar Tea Gardens",
      "Kathakali Show, Kochi",
      "Fort Kochi Chinese Nets",
      "Marari Beach",
      "Mattancherry Palace",
      "Eravikulam National Park",
      "Jew Town Antiques",
      "Top Station Viewpoint",
      "Ayurvedic Spa Session",
      "Kumarakom Bird Sanctuary",
    ],
    eats: ["Kayees Biryani", "Ginger House", "Saravana Bhavan", "Fort House Restaurant", "Rapsy Restaurant"],
  },
];

export const INTRO_CHIPS = [
  { id: "inspire", label: "Inspire me where to go" },
  { id: "itinerary", label: "Build me an itinerary" },
  { id: "booking", label: "Help me with booking" },
];

export const DURATION_PLANS = [
  { id: "4d", label: "4D: culture, beaches", days: 4, theme: "Culture & Beach Lovers" },
  { id: "5d", label: "5D: food, adventure", days: 5, theme: "Food & Adventure Seekers" },
  { id: "7d", label: "7D: culture, beaches", days: 7, theme: "Slow Travel & Culture" },
];

export const FALLBACK_REPLIES = [
  "Great thought! Tell me a vibe — beaches, mountains, food trails — and I'll fetch matching destinations.",
  "Noted! Want me to suggest destinations, or should I start building an itinerary right away?",
  "I can help with that. Try tapping one of the suggestion chips, or just tell me your travel mood!",
];

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export function buildDays(destination, numDays) {
  const days = [];
  for (let d = 0; d < numDays; d++) {
    const p = destination.places;
    const e = destination.eats;
    days.push({
      id: `day-${d + 1}-${Date.now()}`,
      label: `Day ${d + 1}`,
      stops: [
        { id: `s-${d}-0`, kind: "meal", label: "Breakfast", detail: e[(d * 3) % e.length] },
        { id: `s-${d}-1`, kind: "place", label: "Place 1", detail: p[(d * 3) % p.length] },
        { id: `s-${d}-2`, kind: "meal", label: "Lunch", detail: e[(d * 3 + 1) % e.length] },
        { id: `s-${d}-3`, kind: "place", label: "Place 2", detail: p[(d * 3 + 1) % p.length] },
        { id: `s-${d}-4`, kind: "place", label: "Place 3", detail: p[(d * 3 + 2) % p.length] },
        { id: `s-${d}-5`, kind: "meal", label: "Dinner", detail: e[(d * 3 + 2) % e.length] },
      ],
    });
  }
  return days;
}

const GOA_HOTELS = [
  {
    id: "goa-h1",
    name: "Tropicana Beach Resort",
    rating: 8.6,
    reviews: "4.5K",
    pricePerNight: 9800,
    image:
      "https://images.pexels.com/photos/13585378/pexels-photo-13585378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "goa-h2",
    name: "Palm Grove Inn",
    rating: 8.1,
    reviews: "2.1K",
    pricePerNight: 6200,
    image:
      "https://images.unsplash.com/photo-1725006136539-46bef885df06?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTYxOTF8MHwxfHNlYXJjaHwyfHxiZWFjaCUyMHJlc29ydCUyMGhvdGVsJTIwcG9vbCUyMGdvYXxlbnwwfHx8fDE3ODk3MzA5MTl8MA&ixlib=rb-4.1.0&q=85",
  },
];

export const HOTELS = {
  goa: GOA_HOTELS,
  jaipur: [
    {
      id: "jai-h1",
      name: "Royal Orchid Palace",
      rating: 8.6,
      reviews: "4.5K",
      pricePerNight: 8400,
      image:
        "https://images.unsplash.com/photo-1589901164570-f9de6556e1c1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxpbmRpYSUyMGhlcml0YWdlJTIwcGFsYWNlJTIwaG90ZWx8ZW58MHx8fHwxNzg5NzMwOTE5fDA&ixlib=rb-4.1.0&q=85",
    },
    {
      id: "jai-h2",
      name: "Pink City Haveli",
      rating: 8.1,
      reviews: "2.1K",
      pricePerNight: 5400,
      image:
        "https://images.unsplash.com/photo-1590766940554-634a7ed41450?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHxpbmRpYSUyMGhlcml0YWdlJTIwcGFsYWNlJTIwaG90ZWx8ZW58MHx8fHwxNzg5NzMwOTE5fDA&ixlib=rb-4.1.0&q=85",
    },
  ],
  kerala: [
    {
      id: "ker-h1",
      name: "Backwater Ripples Resort",
      rating: 8.6,
      reviews: "4.5K",
      pricePerNight: 9200,
      image:
        "https://images.pexels.com/photos/37833119/pexels-photo-37833119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      id: "ker-h2",
      name: "Coconut Lagoon Inn",
      rating: 8.1,
      reviews: "2.1K",
      pricePerNight: 5900,
      image:
        "https://images.unsplash.com/photo-1674205710296-606898df6642?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTYxOTF8MHwxfHNlYXJjaHwzfHxiZWFjaCUyMHJlc29ydCUyMGhvdGVsJTIwcG9vbCUyMGdvYXxlbnwwfHx8fDE3ODk3MzA5MTl8MA&ixlib=rb-4.1.0&q=85",
    },
  ],
  default: GOA_HOTELS,
};

export function formatINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function parseBudget(text) {
  const clean = text.replace(/,/g, "");
  const lakh = clean.match(/([\d.]+)\s*(lakh|lac)\b/i);
  if (lakh) return parseFloat(lakh[1]) * 100000;
  const k = clean.match(/([\d.]+)\s*k\b/i);
  if (k) return parseFloat(k[1]) * 1000;
  const num = clean.replace(/[₹\s]/g, "").match(/\d{4,}/);
  return num ? parseInt(num[0], 10) : null;
}

export function flightPrice(destination) {
  const m = destination.flight.replace(/,/g, "").match(/\d+/);
  return m ? parseInt(m[0], 10) : 5000;
}
