import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    // Don't send passwords to the frontend
    const safeUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    }));
    return NextResponse.json({ success: true, data: safeUsers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
