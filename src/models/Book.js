import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this book.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  author: {
    type: String,
    required: [true, "Please provide the author's name."],
    maxlength: [60, "Author's name cannot be more than 60 characters"],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for the book.'],
  },
  mrp: {
    type: Number,
    required: [true, 'Please provide the original MRP.'],
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: [true, 'Please specify a category.'],
  },
  condition: {
    type: String,
    required: [true, 'Please specify the condition of the book.'],
  },
  status: {
    type: String,
    enum: ['Active', 'Sold', 'Pending'],
    default: 'Active',
  },
  photos: [String],
  seller: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// In development, delete the cached model to force schema refresh
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Book;
}

export default mongoose.models.Book || mongoose.model('Book', BookSchema);

