import mongoose from 'mongoose';

const fixtureSchema = new mongoose.Schema({
  home_team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, 'Home team is required']
  },
  away_team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, 'Away team is required']
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
    default: 'ClubVerse Arena',
    trim: true,
    maxlength: 150
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Live', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  home_score: {
    type: Number,
    default: 0
  },
  away_score: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Fixture || mongoose.model('Fixture', fixtureSchema);
