import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Book from '@/models/Book';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Get the current state before update
    const currentBook = await Book.findById(id);
    if (!currentBook) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, body, { new: true });

    // Synchronization logic requested by USER:
    // 1. If changed to Active: remove items from purchase (Orders)
    if (body.status === 'Active' && currentBook.status !== 'Active') {
      await Order.deleteMany({ bookId: id });
    }

    // 2. If changed to Sold: add record (order) to that buyer
    if (body.status === 'Sold' && currentBook.status !== 'Sold') {
      // Create a mock order if one doesn't exist yet for this book
      const existingOrder = await Order.findOne({ bookId: id });
      if (!existingOrder) {
        await Order.create({
          bookId: id,
          buyerName: body.buyerName || "Admin Manual Checkout",
          sellerName: currentBook.seller,
          title: currentBook.title,
          price: currentBook.price,
          mrp: currentBook.mrp,
          cover: (currentBook.photos && currentBook.photos[0]) || currentBook.cover,
          status: 'Completed'
        });
      }
    }

    return NextResponse.json({ success: true, data: updatedBook });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
