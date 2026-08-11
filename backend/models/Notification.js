import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: 150
  },
  message: {
    type: String,
    required: [true, 'Notification message content is required']
  },
  is_read: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
