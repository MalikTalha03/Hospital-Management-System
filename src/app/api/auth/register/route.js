import { db } from '@/utils/db'; // Ensure you have this Firebase setup
import { hashPassword } from '@/utils/auth';

const handler = async function POST(req) {
    try {
        const { email, password, name } = await req.json();

        // Check if the user already exists
        const userRef = db.collection('users').where('email', '==', email);
        const snap = await userRef.get();
        if (!snap.empty) {
            return new Response('User already exists', { status: 403 });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the user document
        await db.collection('users').add({
            email,
            password: hashedPassword,
            name,
            createdAt: new Date()
        });

        return new Response('User created successfully', { status: 201 });
    } catch (error) {
        console.log(error);
        return new Response(error.message, { status: 500 });
    }
}

export { handler as POST };
