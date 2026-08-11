import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  match_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: [true, 'Match reference is required']
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  seat_number: {
    type: String,
    required: [true, 'Seat number is required'],
    maxlength: 20
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
  ticket_status: {
    type: String,
    enum: ['Booked', 'Cancelled'],
    default: 'Booked'
  }
});

export default mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
