import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');

    if (!user) {
      return NextResponse.json({ success: true, data: [] });
    }

    let filter = {
      $or: [{ sender: user }, { recipient: user }]
    };

    const messages = await Message.find(filter).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const message = await Message.create(body);
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
export async function PUT(request) {
  try {
    await dbConnect();
    const { user, other, bookId } = await request.json();
    
    let filter = {
      recipient: user,
      sender: other,
      isRead: false
    };
    if (bookId) filter.bookId = bookId;

    await Message.updateMany(filter, { isRead: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
