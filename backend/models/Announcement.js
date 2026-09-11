import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, 'Announcement content is required']
  },
  author: {
    type: String,
    default: 'Head Coach'
  },
  category: {
    type: String,
    default: 'Coach Announcement'
  },
  published_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
