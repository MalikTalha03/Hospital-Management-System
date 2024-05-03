import { Patient } from "@/models/patient";
import { connectToDatabase } from "@/utils/db";

export const PATCH = async (req, { params }) => {
  await connectToDatabase();
  try {
    const { id } = params;
    const data = await req.json();
    const patient = await Patient.findByIdAndUpdate(id, data, { new: true });
    return new Response(JSON.stringify(patient), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};

export const GET = async (req, { params }) => {
  await connectToDatabase();
  try {
    const { id } = params;
    const patient = await Patient.findById(id);
    return new Response(JSON.stringify(patient), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  await connectToDatabase();
  try {
    const { id } = params;
    await Patient.findByIdAndDelete(id);
    return new Response("Patient deleted successfully", { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};