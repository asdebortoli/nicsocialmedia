import user from "@/lib/db/schemas/user";
import bcrypt from "bcrypt";
import { Document, Types } from "mongoose";

const salt = 10;

interface UserDocument {
    _id: string | Types.ObjectId;
    username: string;
    password?: string;
    role: string;
}

export async function getAllUsers(): Promise<UserDocument[]> {
    try {
        return await user.find().select('-password').lean();
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw new Error('Failed to fetch users');
    }
}

export async function getUser(id: string): Promise<UserDocument | null> {
    try {
        return await user.findById(id).lean();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user');
    }
}

export async function loginUser(username: string, password: string): Promise<UserDocument | null> {
    try {
        const loggedUser = await user.findOne({ username: username }).lean();
        
        if (!loggedUser || !loggedUser.password) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, loggedUser.password);
        if (!isPasswordValid) {
            return null;
        }

        // Remove password from returned user
        const { password: _, ...userWithoutPassword } = loggedUser;
        return userWithoutPassword as UserDocument;
    } catch (error) {
        console.error('Error during login:', error);
        throw new Error('Login failed');
    }
}

export async function addUser(username: string, password: string, role: string): Promise<UserDocument> {
    try {
        // Check if user already exists
        const existingUser = await user.findOne({ username });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new user({
            username: username,
            password: hashedPassword,
            role: role
        });
        
        const savedUser = await newUser.save();
        // Return user without password
        const { password: _, ...userWithoutPassword } = savedUser.toObject();
        return userWithoutPassword as UserDocument;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

export async function deleteUser(id: string): Promise<UserDocument | null> {
    try {
        return await user.findByIdAndDelete(id).lean();
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
}