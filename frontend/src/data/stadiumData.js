export const STADIUMS_LIST = [
  {
    id: "apex-central",
    name: "Apex Central Arena",
    location: "London, UK • East End District",
    capacity: "250 Seats • 11v11 FIFA Pitch",
    pricePerHour: 5000,
    availabilityStatus: "Available",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80"
    ],
    pitchType: "Hybrid Desso GrassMaster",
    dimensions: "105m x 68m (UEFA Elite Standard)",
    description: "The flagship 250-seat stadium of ClubVerse FC featuring 50 VIP seats (25 North, 25 South), 120 pitchside seats (30 each across 4 sides), and 80 outer stand seats (20 each across 4 sides). Fully equipped with state-of-the-art hybrid grass turf.",
    facilities: [
      "250 Total Seating Capacity",
      "50 VIP Platinum Seats (25 North Stand, 25 South Stand)",
      "120 Pitchside Seats (4 Sides × 30)",
      "80 Outer Stand Seats (4 Sides × 20)",
      "4K Floodlight System",
      "8 VIP Dressing Locker Rooms",
      "Press & Media Center"
    ],
    blocked_dates: [],
    rating: 4.9,
    reviewsCount: 128
  },
  {
    id: "metropolis-turf",
    name: "Metropolis Olympic Arena",
    location: "Manchester, UK • Sports City Hub",
    capacity: "250 Seats • Convertible Pitch",
    pricePerHour: 3000,
    availabilityStatus: "Available",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80"
    ],
    pitchType: "Shock-Absorbing 4G Synthetic",
    dimensions: "100m x 64m",
    description: "A futuristic 250-seat stadium venue equipped with shock-absorbing synthetic turf, 360° digital LED scoreboards, indoor warm-up arenas, and high-speed match broadcast infrastructure.",
    facilities: [
      "250 Seats Circular Arena",
      "Shock-Absorbing 4G Turf",
      "Indoor Warmup Facility",
      "Digital HD Scoreboard",
      "4 Team Dressing Rooms"
    ],
    blocked_dates: [],
    rating: 4.8,
    reviewsCount: 94
  }
];

// Discrete non-continuous matchday event dates
export const MATCH_EVENTS = [
  { id: 'ev-1', dateStr: '2026-08-15', matchTitle: 'ClubVerse FC vs Northern Derby', competition: 'Premier League', badge: '🔥 Marquee Match' },
  { id: 'ev-2', dateStr: '2026-08-22', matchTitle: 'ClubVerse FC vs Real Madrid', competition: 'Champions League', badge: '🏆 Elite Cup' },
  { id: 'ev-3', dateStr: '2026-09-05', matchTitle: 'ClubVerse FC vs Arsenal FC', competition: 'Premier League', badge: '⚡ High Demand' },
  { id: 'ev-4', dateStr: '2026-09-18', matchTitle: 'ClubVerse FC vs Bayern Munich', competition: 'Champions League', badge: '🌟 VIP Special' }
];

// 250 Total Seats Configuration (50 VIP [25 North, 25 South], 120 Pitchside [4 sides x 30], 80 Outer [4 sides x 20])
export const STADIUM_STANDS = [
  { id: 'vip-north', name: 'North VIP Platinum (25 Seats)', price: 5000, rowCount: 1, seatPerRow: 25 },
  { id: 'vip-south', name: 'South VIP Platinum (25 Seats)', price: 5000, rowCount: 1, seatPerRow: 25 },
  { id: 'pitch-north', name: 'North Pitchside (30 Seats)', price: 3000, rowCount: 2, seatPerRow: 15 },
  { id: 'pitch-south', name: 'South Pitchside (30 Seats)', price: 3000, rowCount: 2, seatPerRow: 15 },
  { id: 'pitch-east', name: 'East Pitchside (30 Seats)', price: 3000, rowCount: 2, seatPerRow: 15 },
  { id: 'pitch-west', name: 'West Pitchside (30 Seats)', price: 3000, rowCount: 2, seatPerRow: 15 },
  { id: 'outer-north', name: 'North Outer Stand (20 Seats)', price: 1000, rowCount: 2, seatPerRow: 10 },
  { id: 'outer-south', name: 'South Outer Stand (20 Seats)', price: 1000, rowCount: 2, seatPerRow: 10 },
  { id: 'outer-east', name: 'East Outer Stand (20 Seats)', price: 1000, rowCount: 2, seatPerRow: 10 },
  { id: 'outer-west', name: 'West Outer Stand (20 Seats)', price: 1000, rowCount: 2, seatPerRow: 10 }
];

export const VIRTUAL_STADIUM_SECTIONS = [
  // TIER 1: VIP TIER (50 Seats total: 25 North + 25 South) @ ₹5,000
  { id: 'sec-vip-north', code: 'VIP-N', name: 'North VIP Suite', tier: 'VIP Tier', price: 5000, color: '#8B5CF6', ring: 'inner', seatCount: 25, viewAngle: 'North Center Pitch VIP View' },
  { id: 'sec-vip-south', code: 'VIP-S', name: 'South VIP Suite', tier: 'VIP Tier', price: 5000, color: '#8B5CF6', ring: 'inner', seatCount: 25, viewAngle: 'South Center Pitch VIP View' },

  // TIER 2: PITCHSIDE TIER (120 Seats: 4 sides x 30 seats) @ ₹3,000
  { id: 'sec-pitch-north', code: 'PITCH-N', name: 'North Pitchside', tier: 'Pitchside Tier', price: 3000, color: '#F59E0B', ring: 'middle', seatCount: 30, viewAngle: 'North Touchline Pitchside View' },
  { id: 'sec-pitch-south', code: 'PITCH-S', name: 'South Pitchside', tier: 'Pitchside Tier', price: 3000, color: '#F59E0B', ring: 'middle', seatCount: 30, viewAngle: 'South Touchline Pitchside View' },
  { id: 'sec-pitch-east', code: 'PITCH-E', name: 'East Pitchside', tier: 'Pitchside Tier', price: 3000, color: '#F59E0B', ring: 'middle', seatCount: 30, viewAngle: 'East Touchline Pitchside View' },
  { id: 'sec-pitch-west', code: 'PITCH-W', name: 'West Pitchside', tier: 'Pitchside Tier', price: 3000, color: '#F59E0B', ring: 'middle', seatCount: 30, viewAngle: 'West Touchline Pitchside View' },

  // TIER 3: OUTER STAND TIER (80 Seats: 4 sides x 20 seats) @ ₹1,000
  { id: 'sec-outer-north', code: 'OUTER-N', name: 'North Outer Stand', tier: 'Outer Stand Tier', price: 1000, color: '#6366F1', ring: 'outer', seatCount: 20, viewAngle: 'Panoramic North View' },
  { id: 'sec-outer-south', code: 'OUTER-S', name: 'South Outer Stand', tier: 'Outer Stand Tier', price: 1000, color: '#6366F1', ring: 'outer', seatCount: 20, viewAngle: 'Panoramic South View' },
  { id: 'sec-outer-east', code: 'OUTER-E', name: 'East Outer Stand', tier: 'Outer Stand Tier', price: 1000, color: '#6366F1', ring: 'outer', seatCount: 20, viewAngle: 'Panoramic East View' },
  { id: 'sec-outer-west', code: 'OUTER-W', name: 'West Outer Stand', tier: 'Outer Stand Tier', price: 1000, color: '#6366F1', ring: 'outer', seatCount: 20, viewAngle: 'Panoramic West View' }
];

// Red booked seats list
export const PRE_BOOKED_SEATS = [
  'VIP-R1-S2', 'VIP-R1-S3', 'GOLD-NORTH-R1-S4',
  'GOLD-SOUTH-R1-S5', 'GOLD-EAST-R2-S8', 'SILVER-NORTH-R1-S1'
];

export const INITIAL_MOCK_BOOKINGS = [
  {
    _id: "STAD-89421",
    stadium_id: "apex-central",
    stadium_name: "Apex Central Arena",
    stadium_image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    location: "London, UK • East End District",
    user_id: "guest",
    user_name: "Alexander Wright",
    user_email: "alexander.wright@clubverse.com",
    user_phone: "+44 7700 900077",
    team_name: "ClubVerse Fan XI",
    special_notes: "Request main gate entry pass.",
    booking_date: "2026-08-15",
    match_title: "ClubVerse FC vs Northern Derby",
    selected_seats: ["VIP-R1-S4 (₹5,000)", "VIP-R1-S5 (₹5,000)"],
    total_seats: 2,
    hourly_rate: 5000,
    total_price: 10000,
    payment_method: "Fan Wallet Balance",
    payment_status: "Paid",
    booking_status: "Confirmed",
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

