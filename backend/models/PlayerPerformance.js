import mongoose from 'mongoose';

const playerPerformanceSchema = new mongoose.Schema({
  player_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: [true, 'Player reference is required']
  },
  match_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: [true, 'Match reference is required']
  },
  goals: {
    type: Number,
    default: 0
  },
  assists: {
    type: Number,
    default: 0
  },
  passes: {
    type: Number,
    default: 0
  },
  pass_accuracy: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.PlayerPerformance || mongoose.model('PlayerPerformance', playerPerformanceSchema);
