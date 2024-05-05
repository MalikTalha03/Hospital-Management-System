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

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();
    if (snapshot.empty) {
      return new Response("User not found", { status: 404 });
    }

    const userDoc = snapshot.docs[0];

    const hashedPassword = await hashPassword(password);

    await usersRef.doc(userDoc.id).update({
      password: hashedPassword,
    });

    return new Response("Password updated successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};

export { handler as POST };
