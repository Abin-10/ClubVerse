import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  full_name: {
    type: String,
    required: [true, 'Player full name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    default: null,
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Playing position is required'],
    maxlength: 50
  },
  jersey_number: {
    type: Number,
    sparse: true
  },
  date_of_birth: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  nationality: {
    type: String,
    default: null,
    maxlength: 50
  },
  preferred_foot: {
    type: String,
    default: 'Left'
  },
  height: {
    type: String,
    default: '178 cm'
  },
  weight: {
    type: String,
    default: '72 kg'
  },
  contract_term: {
    type: String,
    default: 'June 2029'
  },
  role_access: {
    type: String,
    default: 'First Team Professional Player'
  },
  market_value: {
    type: String,
    default: '€120M'
  },
  medical_clearance: {
    type: String,
    default: '100% Match Fit'
  },
  bio: {
    type: String,
    default: 'Passionate ClubVerse VIP Supporter ⚽'
  },
  profile_image: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

export default mongoose.models.Player || mongoose.model('Player', playerSchema);
