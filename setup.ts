import {connectDB, disconnectDB} from './lib/db/mongodb';
import 'dotenv/config';

async function addAdminUser() {
    const { addUser } = await import('@/models/user');
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin';
    const role = 'admin';

    try {
        await connectDB();
        const user = await addUser(username, password, role);
        console.log(`Admin user created: ${user.username}`);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await disconnectDB();
    }
}

addAdminUser(); 