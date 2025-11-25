import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/models/user';
import { connectDB } from '@/lib/db/mongodb';
import { createSecretToken } from '@/lib/auth';
import { HTTP_STATUS } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' }, 
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const user = await loginUser(username, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' }, 
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const accessToken = createSecretToken(user._id.toString());    const response = NextResponse.json({ 
      accessToken,
      user: {
        id: user._id.toString(),
        username: user.username,
        role: user.role
      }
    });

    // Set access token as httpOnly cookie for better security
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}