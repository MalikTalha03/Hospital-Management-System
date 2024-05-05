import { db } from "@/utils/db";

const handler = async function POST(req, res) {
  try {
    const { name, specialization, experience, fee, phone, email } =
      await req.json();
    const doctorsRef = db.collection("doctors");
    const query = doctorsRef
      .where("email", "==", email)
      .where("name", "==", name)
      .where("phone", "==", phone);
    const snapshot = await query.get();

    if (!snapshot.empty) {
      return new Response("Doctor already exists", { status: 403 });
    }

    const newDoctor = {
      name,
      specialization,
      experience,
      fee,
      phone,
      email,
      createdAt: new Date(),
    };

    const docRef = await doctorsRef.add(newDoctor);
    return new Response("Doctor created successfully", {
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: docRef.id }),
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};

export { handler as POST };
