import { db } from "@/utils/db";

export const GET = async (req) => {
  try {
    const url = new URL(req.url);
    const doctorId = url.searchParams.get("doctorId");
    const date = url.searchParams.get("date");

    const dayOfWeek = new Date(date).getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = days[dayOfWeek];

    const appointmentsQuery = db
      .collection("appointments")
      .where("doctorId", "==", doctorId)
      .where("date", "==", date);
    const appointmentsSnapshot = await appointmentsQuery.get();

    const slotCounts = {};
    appointmentsSnapshot.docs.forEach((doc) => {
      const time = doc.data().time;
      if (slotCounts[time]) {
        slotCounts[time] += 1;
      } else {
        slotCounts[time] = 1;
      }
    });

    const doctorRef = db.collection("doctors").doc(doctorId);
    const doctorDoc = await doctorRef.get();
    const availableDays = doctorDoc.data()?.availableDays || [];
    const availableSlots = [];

    if (availableDays.includes(day)) {
      const slotsDoc = await doctorRef.collection("slots").doc(day).get();
      const slots = slotsDoc.data()?.slots || [];

      slots.forEach((slot) => {
        if (!(slotCounts[slot] && slotCounts[slot] >= 2)) {
          availableSlots.push({ day, slot });
        }
      });
    }

    return new Response(JSON.stringify(availableSlots), { status: 200 });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
