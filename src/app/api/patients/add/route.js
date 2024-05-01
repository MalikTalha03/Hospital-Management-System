import { Patient } from "@/models/patient";
import { connectToDatabase } from "@/utils/db";

const handler = async function POST(req) {
  await connectToDatabase(); 

  try {
    const { name, age, gender, bloodGroup, phone, email } = await req.json();
    const existingPatient = await Patient.findOne({ email, name, phone });
    if (existingPatient) {
      return new Response("Patient already exists", { status: 403 });
    }
    const patient = new Patient({
      name,
      age,
      gender,
      bloodGroup,
      phone,
      email,
    });
    await patient.save();
    return new Response("Patient created successfully", { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
};

export { handler as POST };