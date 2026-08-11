import mongoose from 'mongoose';

const aiMatchSummarySchema = new mongoose.Schema({
  match_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: [true, 'Match reference is required']
  },
  summary: {
    type: String,
    required: [true, 'Match summary text is required']
  },
  generated_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.AIMatchSummary || mongoose.model('AIMatchSummary', aiMatchSummarySchema);
