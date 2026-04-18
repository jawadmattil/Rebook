import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Book from '@/models/Book';

export async function GET() {
  try {
    await dbConnect();
    // Just a simple query to see if connection is successful
    const count = await Book.countDocuments();
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB!',
      bookCount: count 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to database',
      details: error.message 
    }, { status: 500 });
  }
}
