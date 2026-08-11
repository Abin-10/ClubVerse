import mongoose from 'mongoose';

const aiChatHistorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  question: {
    type: String,
    required: [true, 'User question is required']
  },
  response: {
    type: String,
    required: [true, 'AI response is required']
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.AIChatHistory || mongoose.model('AIChatHistory', aiChatHistorySchema);
