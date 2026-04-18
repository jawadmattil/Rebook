import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Book from '@/models/Book';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const buyer = searchParams.get('buyer');
    const seller = searchParams.get('seller');

    let filter = {};
    if (buyer) filter.buyerName = buyer;
    if (seller) filter.sellerName = seller;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Create the order
    const order = await Order.create(body);

    // Update book status - if order is pending, book is pending; otherwise sold
    if (body.bookId) {
       const bookStatus = order.status === 'Pending' ? 'Pending' : 'Sold';
       await Book.findByIdAndUpdate(body.bookId, { status: bookStatus });
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
       return NextResponse.json({ success: false, error: "Order ID required" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
       return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Mark the book as active again
    if (order.bookId) {
       await Book.findByIdAndUpdate(order.bookId, { status: 'Active' });
    }

    // Delete the order or mark as Cancelled
    await Order.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
