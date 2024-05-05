import { db } from '@/utils/db';  

const handler = async function POST(req, res) {
  try {
    const { name, age, gender, bloodGroup, phone, email } = await req.json();

    const patientsRef = db.collection('patients');
    const query = patientsRef.where('email', '==', email).where('name', '==', name).where('phone', '==', phone);
    const snapshot = await query.get();

    if (!snapshot.empty) {
      return new Response("Patient already exists", { status: 403 });
    }

    const newPatient = {
      name,
      age,
      gender,
      bloodGroup,
      phone,
      email,
      createdAt: new Date()  
    };

    const docRef = await patientsRef.add(newPatient);
    return new Response("Patient created successfully", { status: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: docRef.id }) });

  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};

export { handler as POST };
