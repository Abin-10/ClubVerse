import mongoose from 'mongoose';

const stadiumBookingSchema = new mongoose.Schema({
  stadium_id: {
    type: String,
    required: [true, 'Stadium ID is required']
  },
  stadium_name: {
    type: String,
    required: [true, 'Stadium name is required']
  },
  stadium_image: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  user_id: {
    type: String,
    default: 'guest'
  },
  user_name: {
    type: String,
    required: [true, 'User full name is required']
  },
  user_email: {
    type: String,
    required: [true, 'User email is required']
  },
  user_phone: {
    type: String,
    default: ''
  },
  team_name: {
    type: String,
    default: ''
  },
  special_notes: {
    type: String,
    default: ''
  },
  booking_date: {
    type: String, // YYYY-MM-DD
    required: [true, 'Booking date is required']
  },
  match_title: {
    type: String,
    default: 'ClubVerse Matchday'
  },
  selected_seats: {
    type: [String],
    default: []
  },
  total_seats: {
    type: Number,
    default: 1
  },
  time_slot: {
    type: String,
    default: 'Matchday Session'
  },
  duration_hours: {
    type: Number,
    default: 2
  },
  hourly_rate: {
    type: Number,
    default: 5000
  },
  total_price: {
    type: Number,
    required: true
  },
  payment_method: {
    type: String,
    enum: ['Fan Wallet Balance', 'Pay at Venue', 'Credit / Debit Card'],
    default: 'Fan Wallet Balance'
  },
  payment_status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Paid'],
    default: 'Paid'
  },
  booking_status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.StadiumBooking || mongoose.model('StadiumBooking', stadiumBookingSchema);
