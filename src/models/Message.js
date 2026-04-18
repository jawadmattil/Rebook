import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String, // name or email
    required: true,
  },
  recipient: {
    type: String, // name or email
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
