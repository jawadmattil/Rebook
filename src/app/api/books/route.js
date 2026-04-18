import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Book from '@/models/Book';

// GET all books
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    const seller = searchParams.get('seller');

    let filter = {};
    if (category) filter.category = category;
    if (seller) filter.seller = seller;
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ];
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: books });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST a new book
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Convert price string like "₹450" to number if needed, or just store as string
    // Given the model, price is a Number. Let's clean the input.
    const cleanPrice = typeof body.price === 'string' 
      ? Number(body.price.replace(/[^\d.-]/g, '')) 
      : body.price;
    
    const cleanMrp = typeof body.mrp === 'string'
      ? Number(body.mrp.replace(/[^\d.-]/g, ''))
      : body.mrp;

    const bookData = {
      ...body,
      price: cleanPrice,
      mrp: cleanMrp
    };

    const book = await Book.create(bookData);
    return NextResponse.json({ success: true, data: book }, { status: 201 });
  } catch (error) {
    console.error("POST /api/books error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
