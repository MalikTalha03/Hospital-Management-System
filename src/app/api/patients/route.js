import { db } from '@/utils/db';  // Make sure Firebase is correctly initialized

const handler = async function GET() {
  try {
    const patientsRef = db.collection('patients');
    const snapshot = await patientsRef.get();

    if (snapshot.empty) {
      return new Response("No patients found", { status: 404 });
    }

    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(patients), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
}

export { handler as GET };
