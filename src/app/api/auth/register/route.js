import mongoose from 'mongoose';
import { User } from '@/models/user';
import { hashPassword } from '@/utils/auth';
import { connectToDatabase } from '@/utils/db';


const handler = async function POST(req) {
    await connectToDatabase(); // Ensure connection before proceeding

    try {
        const { email, password, name } = await req.json();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response('User already exists', { status: 403 });
        }
        const hashedPassword = await hashPassword(password);
        const user = new User({
            email,
            password: hashedPassword,
            name,
        });
        await user.save();
        return new Response('User created successfully', { status: 201 });
    } catch (error) {
        console.log(error)
        return new Response(error.message, { status: 500 });
    }
}

export { handler as POST };
