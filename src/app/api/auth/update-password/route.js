import { db } from "@/utils/db";
import { hashPassword } from "@/utils/auth";

const handler = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response("Email and password are required", { status: 400 });
    }

    // Check if the user exists in Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) {
      return new Response("User not found", { status: 404 });
    }

    // Assuming there's only one user with this email
    const userDoc = snapshot.docs[0];

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update the user's password
    await usersRef.doc(userDoc.id).update({
      password: hashedPassword
    });

    return new Response("Password updated successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
}

export { handler as POST };
