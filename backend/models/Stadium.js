import mongoose from 'mongoose';

const stadiumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Stadium name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  capacity: {
    type: String,
    required: [true, 'Capacity is required'],
    default: '250 Seats'
  },
  price_per_hour: {
    type: Number,
    required: false,
    default: 0
  },
  availability_status: {
    type: String,
    enum: ['Available', 'Limited Slots', 'Maintenance', 'Fully Booked'],
    default: 'Available'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80'
  },
  gallery: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  pitch_type: {
    type: String,
    default: 'FIFA Certified Hybrid Grass'
  },
  dimensions: {
    type: String,
    default: '105m x 68m (UEFA Standard)'
  },
  facilities: {
    type: [String],
    default: ['Floodlight System', 'Dressing Locker Rooms', 'Press Room', 'Spectator Parking']
  },
  blocked_dates: {
    type: [String], // Array of YYYY-MM-DD strings blocked by Admin
    default: []
  },
  seating_tiers: {
    type: [
      {
        name: { type: String, default: '' },
        price: { type: Number, default: 0 },
        seats_info: { type: String, default: '' },
        total_seats: { type: Number, default: 0 }
      }
    ],
    default: [
      {
        name: 'VIP Seats',
        price: 5000,
        seats_info: '50 Seats (25 North / 25 South)',
        total_seats: 50
      },
      {
        name: '4 Side Prime',
        price: 3000,
        seats_info: '30 Seats Each Side (Total 120 Seats)',
        total_seats: 120
      },
      {
        name: '4 Side Regular',
        price: 1000,
        seats_info: '20 Seats Each Side (Total 80 Seats)',
        total_seats: 80
      }
    ]
  },
  rating: {
    type: Number,
    default: 4.8
  },
  reviews_count: {
    type: Number,
    default: 48
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Stadium || mongoose.model('Stadium', stadiumSchema);
