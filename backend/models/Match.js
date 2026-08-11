import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  opponent: {
    type: String,
    required: [true, 'Opponent team name is required'],
    trim: true,
    maxlength: 100
  },
  match_date: {
    type: Date,
    required: [true, 'Match date is required']
  },
  match_time: {
    type: String,
    required: [true, 'Match time is required'],
    trim: true
  },
  venue: {
    type: String,
    required: [true, 'Match venue is required'],
    trim: true,
    maxlength: 150
  },
  competition: {
    type: String,
    default: null,
    maxlength: 100
  },
  home_score: {
    type: Number,
    default: 0
  },
  away_score: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  }
});

export default mongoose.models.Match || mongoose.model('Match', matchSchema);
