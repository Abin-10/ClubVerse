import mongoose from 'mongoose';

const fanPollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    default: 'Who will score first in the Derby?'
  },
  reward_points: {
    type: Number,
    default: 50
  },
  options: [
    {
      id: { type: String, required: true },
      label: { type: String, required: true },
      votes: { type: Number, default: 0 }
    }
  ],
  voted_users: [
    {
      user_id: { type: String, required: true },
      option_id: { type: String, required: true }
    }
  ],
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.FanPoll || mongoose.model('FanPoll', fanPollSchema);
