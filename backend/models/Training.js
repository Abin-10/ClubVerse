import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
  coach_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    default: null
  },
  training_date: {
    type: Date,
    required: [true, 'Training date is required']
  },
  training_time: {
    type: String,
    required: [true, 'Training time is required'],
    trim: true
  },
  venue: {
    type: String,
    required: [true, 'Training venue is required'],
    trim: true,
    maxlength: 150
  },
  training_type: {
    type: String,
    default: null,
    maxlength: 100
  },
  description: {
    type: String,
    default: null
  }
});

export default mongoose.models.Training || mongoose.model('Training', trainingSchema);
