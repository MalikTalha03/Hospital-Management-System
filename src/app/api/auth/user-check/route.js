import { connectToDatabase } from "@/utils/db";
import { User } from "@/models/user";

const handler = async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDatabase();
      const { email } = await req.json();
      const existingUser = await User.findOne({
        email,
      });
      if (existingUser) {
        return new Response("User already exists", {
          status: 200,
        });
      }
      return new Response("User Not Found", {
        status: 404,
      });
    } catch (error) {
      console.log(error);
      return new Response(error.message, {
        status: 500,
      });
    }
  } else {
    var response = new Response("Method Not Allowed", {
      status: 405,
    });
    response.headers.set("Allow", ["POST"]);
    return response;
  }
}

export { handler as POST}