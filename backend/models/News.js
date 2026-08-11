import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, 'News content is required']
  },
  image: {
    type: String,
    default: null,
    maxlength: 255
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  published_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  }
});

export default mongoose.models.News || mongoose.model('News', newsSchema);
