import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema({
  author_id: {
    type: String,
    default: 'guest'
  },
  author_name: {
    type: String,
    required: [true, 'Author name is required']
  },
  author_avatar: {
    type: String,
    default: ''
  },
  author_badge: {
    type: String,
    default: 'Supporter'
  },
  category: {
    type: String,
    enum: ['Match Debates', 'Predictions', 'Fan Chants', 'Transfer Rumors', 'General'],
    default: 'General'
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  likes_count: {
    type: Number,
    default: 0
  },
  liked_by: {
    type: [String],
    default: []
  },
  comments: {
    type: [
      {
        author_id: { type: String, default: 'guest' },
        author_name: { type: String, required: true },
        author_avatar: { type: String, default: '' },
        content: { type: String, required: true },
        created_at: { type: Date, default: Date.now }
      }
    ],
    default: []
  },
  poll: {
    type: {
      question: { type: String, default: '' },
      options: [
        {
          id: { type: String, required: true },
          text: { type: String, required: true },
          votes: { type: Number, default: 0 }
        }
      ],
      total_votes: { type: Number, default: 0 },
      voted_users: { type: [String], default: [] }
    },
    default: null
  },
  is_pinned: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.CommunityPost || mongoose.model('CommunityPost', communityPostSchema);
