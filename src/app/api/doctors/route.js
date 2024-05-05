import { db } from "@/utils/db";

const handler = async function GET() {
  try {
    const doctorsRef = db.collection("doctors");
    const snapshot = await doctorsRef.get();

    if (snapshot.empty) {
      return new Response("No doctors found", { status: 404 });
    }

    const doctors = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(doctors), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};

export { handler as GET };
