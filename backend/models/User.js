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
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
