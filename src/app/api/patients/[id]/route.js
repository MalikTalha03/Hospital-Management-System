import { db } from "@/utils/db";

export const PATCH = async (req, { params }) => {
  try {
    const { id } = params;
    const data = await req.json();
    const docRef = db.collection('patients').doc(id);

    await docRef.update(data);
    const updatedDoc = await docRef.get();

    return new Response(JSON.stringify(updatedDoc.data()), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};
export const GET = async (req, { params }) => {
  try {
    const { id } = params;
    const docRef = db.collection('patients').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return new Response("Patient not found", { status: 404 });
    }

    return new Response(JSON.stringify(doc.data()), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const { id } = params;
    await db.collection('patients').doc(id).delete();

    return new Response("Patient deleted successfully", { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};
