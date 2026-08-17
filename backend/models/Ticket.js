import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  fixture_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fixture',
    required: [true, 'Fixture reference is required']
  },
  user_id: {
    type: String,
    required: [true, 'User ID is required']
  },
  user_name: {
    type: String,
    default: 'Guest'
  },
  user_email: {
    type: String,
    default: ''
  },
  seat_number: {
    type: String,
    required: [true, 'Seat number is required'],
    maxlength: 30
  },
  section: {
    type: String,
    required: [true, 'Section is required']
  },
  row: {
    type: Number,
    required: true
  },
  seat: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  payment_status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  razorpay_payment_id: {
    type: String,
    default: ''
  },
  razorpay_order_id: {
    type: String,
    default: ''
  },
  ticket_status: {
    type: String,
    enum: ['Booked', 'Cancelled'],
    default: 'Booked'
  }
});

// Compound index to prevent double-booking
ticketSchema.index({ fixture_id: 1, seat_number: 1 }, { unique: true });

export default mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
