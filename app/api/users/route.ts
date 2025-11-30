import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, addUser, deleteUser } from "@/models/user";
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db/mongodb';
import { HTTP_STATUS, USER_ROLES } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    let res = await auth({ allowedGroup: [USER_ROLES.ADMIN] }, request);
    if (res) return res;

    const users = await getAllUsers();
    return NextResponse.json({ users });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    let res = await auth({ allowedGroup: [USER_ROLES.ADMIN] }, request);
    if (res) return res;
    
    const { username, password, role } = await request.json();

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required' }, 
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const newUser = await addUser(username, password, role);
    return NextResponse.json({ user: newUser }, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error instanceof Error && error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'User already exists' }, 
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    let res = await auth({ allowedGroup: [USER_ROLES.ADMIN] }, request);
    if (res) return res;
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
