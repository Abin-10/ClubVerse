import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    unique: true,
    maxlength: 50
  },
  short_name: {
    type: String,
    required: [true, 'Short name is required'],
    trim: true,
    uppercase: true,
    maxlength: 4
  },
  logo_color: {
    type: String,
    default: '#3B82F6'
  },
  logo_url: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Team || mongoose.model('Team', teamSchema);
