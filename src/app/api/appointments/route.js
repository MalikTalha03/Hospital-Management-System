import { db } from "@/utils/db"; 

export const POST = async (req, res) => {
  try {
    const { patientId, doctorId, date, time } = await req.json();
    const query = db
      .collection("appointments")
      .where("date", "==", date)
      .where("time", "==", time);
    const snapshot = await query.get();
    if (snapshot.size >= 2) {
      return new Response(
        "There are already 2 appointments at this time",
        { status: 400 }
      );
    }
    const docRef = db.collection("appointments").doc();
    await docRef.set({ patientId, doctorId, date, time });
    const doc = await docRef.get();
    return new Response(JSON.stringify(doc.data()), { status: 201 });
  } catch (error) {
    console.error("Error adding appointment:", error);
    return new Response(error.message, { status: 500 });
  }
};

export const GET = async (req, res) => {
  try {
    const appointmentsRef = db.collection("appointments");
    const snapshot = await appointmentsRef.get();
    const appointments = [];
    snapshot.forEach((doc) => {
      appointments.push(doc.data());
    });
    return new Response(JSON.stringify(appointments), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};
