import { db } from "@/utils/db"; // Ensure Firebase is set up and Firestore is exported

const handler = async function POST(req, res) {
  try {
    const { name, specialization, experience, fee, phone, email } =
      await req.json();

    // Check if the doctor already exists
    const doctorsRef = db.collection("doctors");
    const query = doctorsRef
      .where("email", "==", email)
      .where("name", "==", name)
      .where("phone", "==", phone);
    const snapshot = await query.get();

    if (!snapshot.empty) {
      return new Response("Doctor already exists", { status: 403 });
    }

    // Create a new doctor document in Firestore
    const newDoctor = {
      name,
      specialization,
      experience,
      fee,
      phone,
      email,
      createdAt: new Date(), // Firestore can handle Date objects natively
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
