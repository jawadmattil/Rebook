import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  title: String,
  price: Number,
  mrp: Number,
  cover: String,
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
