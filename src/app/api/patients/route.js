import { Patient } from "@/models/patient";
import { connectToDatabase } from "@/utils/db";

const handler = async function GET () {
  await connectToDatabase();

  try {
    const patients = await Patient.find();
    return new Response(JSON.stringify(patients), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
}

export { handler as GET };