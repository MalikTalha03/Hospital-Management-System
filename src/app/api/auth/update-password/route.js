import { connectToDatabase } from "@/utils/db";
import { User } from "@/models/user";
import { hashPassword } from "@/utils/auth";

const handler = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectToDatabase();
    const { email, password } = await req.json();  
    if (!email || !password) {
      return new Response("Email and password are required.", {
        status: 400,
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response("User not found.", {
        status: 404,
      });
    }

    const hashedPassword = await hashPassword(password);
    await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword }},
      { new: true } 
    );

    return new Response("Password updated successfully.", {
      status: 200,
    });
  } catch (error) {
    console.error(error); 
    return new Response(error.message, {
      status: 500,
    });
  }
}

export { handler as POST }