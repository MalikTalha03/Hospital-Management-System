import { db } from "@/utils/db";

const handler = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { email } = await req.json();
    
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (!snapshot.empty) {
      return new Response("User already exists", { status: 403 });
    }
    return new Response("User does not exist", { status: 404 });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
}

export { handler as post };