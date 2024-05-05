import { db } from "@/utils/db";

export const GET = async (req) => {
  try {
    const url = new URL(req.url);
    const doctorId = url.searchParams.get("doctorId");
    const date = url.searchParams.get("date");

    // Convert date to day of week as string
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

    // Fetch appointments to find already booked slots
    const appointmentsQuery = db
      .collection("appointments")
      .where("doctorId", "==", doctorId)
      .where("date", "==", date);
    const appointmentsSnapshot = await appointmentsQuery.get();

    // Count each slot booking
    const slotCounts = {};
    appointmentsSnapshot.docs.forEach((doc) => {
      const time = doc.data().time;
      if (slotCounts[time]) {
        slotCounts[time] += 1;
      } else {
        slotCounts[time] = 1;
      }
    });

    // Fetch the doctor's available days and slots
    const doctorRef = db.collection("doctors").doc(doctorId);
    const doctorDoc = await doctorRef.get();
    const availableDays = doctorDoc.data()?.availableDays || [];
    const availableSlots = [];

    // Fetch slots only for the specific day and filter them based on bookings
    if (availableDays.includes(day)) {
      const slotsDoc = await doctorRef.collection("slots").doc(day).get();
      const slots = slotsDoc.data()?.slots || [];

      slots.forEach((slot) => {
        if (!(slotCounts[slot] && slotCounts[slot] >= 2)) {
          // Ensure the slot is included only if booked less than 2 times
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
