import mongoose from 'mongoose';

const aiPlayerAnalysisSchema = new mongoose.Schema({
  player_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: [true, 'Player reference is required']
  },
  analysis: {
    type: String,
    required: [true, 'Player analysis text is required']
  },
  recommendations: {
    type: String,
    default: null
  },
  generated_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.AIPlayerAnalysis || mongoose.model('AIPlayerAnalysis', aiPlayerAnalysisSchema);
