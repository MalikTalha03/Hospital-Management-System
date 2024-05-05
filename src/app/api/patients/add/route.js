import { db } from '@/utils/db';  // Ensure Firebase is set up and Firestore is exported

const handler = async function POST(req, res) {
  try {
    const { name, age, gender, bloodGroup, phone, email } = await req.json();

    // Check if the patient already exists
    const patientsRef = db.collection('patients');
    const query = patientsRef.where('email', '==', email).where('name', '==', name).where('phone', '==', phone);
    const snapshot = await query.get();

    if (!snapshot.empty) {
      return new Response("Patient already exists", { status: 403 });
    }

    // Create a new patient document in Firestore
    const newPatient = {
      name,
      age,
      gender,
      bloodGroup,
      phone,
      email,
      createdAt: new Date()  // Firestore can handle Date objects natively
    };

    const docRef = await patientsRef.add(newPatient);
    return new Response("Patient created successfully", { status: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: docRef.id }) });

  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};

export { handler as POST };
