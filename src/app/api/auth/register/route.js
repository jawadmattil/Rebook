import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
    }

    // Create new user (In a real app, you should hash the password here!)
    const user = await User.create({
      name,
      email,
      password,
    });

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        bio: user.bio,
        location: user.location,
        avatar: user.avatar
      } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
