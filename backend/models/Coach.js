import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  full_name: {
    type: String,
    required: [true, 'Coach full name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    default: null,
    trim: true
  },
  phone: {
    type: String,
    default: null
  },
  specialization: {
    type: String,
    default: null,
    maxlength: 100
  },
  experience: {
    type: Number,
    default: 0
  },
  nationality: {
    type: String,
    default: null,
    maxlength: 50
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

export default mongoose.models.Coach || mongoose.model('Coach', coachSchema);
