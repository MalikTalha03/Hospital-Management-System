import { db } from "@/utils/db";

export const POST = async (req, { params }) => {
  const { id } = params;

  try {
    const { days, slots } = await req.json();
    console.log('Received data:', { days, slots }); 

    const doctorRef = db.collection('doctors').doc(id);

    await doctorRef.update({ availableDays: days });

    const slotsPromises = days.map(day =>
      doctorRef.collection('slots').doc(day).set({ slots }, { merge: true })
    );

    await Promise.all(slotsPromises);

    return new Response(JSON.stringify({ message: 'Slots updated successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error updating slots:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
