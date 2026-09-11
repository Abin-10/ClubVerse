import mongoose from 'mongoose';
import { isValidEmail } from '../utils/validators.js';

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 150,
    validate: {
      validator: function(v) {
        return isValidEmail(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    maxlength: 255
  },
  role: {
    type: String,
    enum: ['Admin', 'Coach', 'Player', 'Fan'],
    default: 'Fan',
    required: true
  },
  phone: {
    type: String,
    default: null,
    maxlength: 30
  },
  profile_image: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: 'Passionate ClubVerse VIP Supporter ⚽'
  },
  favorite_player: {
    type: String,
    default: 'Marcus Rashford'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  dob: {
    type: String,
    default: null
  },
  must_change_password: {
    type: Boolean,
    default: false
  },
  // Fan Dashboard & Virtual Card Wallet Data
  total_balance: {
    type: Number,
    default: 6010.29
  },
  recent_topup: {
    type: Number,
    default: 200.00
  },
  rupee_percentage: {
    type: Number,
    default: 72
  },
  tether_percentage: {
    type: Number,
    default: 28
  },
  card_balance: {
    type: Number,
    default: 390.00
  },
  card_number: {
    type: String,
    default: '5802'
  },
  card_expiry: {
    type: String,
    default: '09/28'
  },
  // Fan Activity Data
  activity_total_hours: {
    type: Number,
    default: 186
  },
  activity_trend: {
    type: String,
    default: '+14.2%'
  },
  weekly_activity: {
    type: Array,
    default: [
      { day: 'Mon', hours: 18, height: '40%' },
      { day: 'Tue', hours: 24, height: '55%' },
      { day: 'Wed', hours: 20, height: '45%' },
      { day: 'Thu', hours: 32, height: '70%' },
      { day: 'Fri', hours: 42, height: '92%', highlight: true },
      { day: 'Sat', hours: 28, height: '60%' },
      { day: 'Sun', hours: 22, height: '50%' }
    ]
  },
  // Fan Spending Data
  spent_this_week: {
    type: Number,
    default: 820.65
  },
  assets_count: {
    type: Number,
    default: 26
  },
  spending_graph: {
    type: Array,
    default: [
      { day: 'Mon', x: 20, y: 110, val: 320 },
      { day: 'Tue', x: 90, y: 130, val: 280 },
      { day: 'Wed', x: 160, y: 90, val: 510 },
      { day: 'Thu', x: 230, y: 120, val: 410 },
      { day: 'Fri', x: 300, y: 40, val: 820.65, label: 'LMCO' },
      { day: 'Sat', x: 370, y: 80, val: 640 },
      { day: 'Sun', x: 440, y: 100, val: 520 }
    ]
  },
  // Perks & VIP Tier
  vip_contract: {
    type: Object,
    default: {
      matchday_vip: 86,
      merch_perks: 10,
      hospitality: 4,
      milestone: 140,
      bonuses: 48,
      hourly: 16
    }
  },
  fan_points: {
    type: Number,
    default: 250
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
