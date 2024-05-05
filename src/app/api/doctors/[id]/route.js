import { db } from "@/utils/db";

export const PATCH = async (req, { params }) => {
  try {
    const { id } = params;
    const data = await req.json();
    const docRef = db.collection("doctors").doc(id);

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
    const docRef = db.collection("doctors").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return new Response("Doctor not found", { status: 404 });
    }

    return new Response(JSON.stringify(doc.data()), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const { id } = params;
    await db.collection("doctors").doc(id).delete();

    return new Response("Doctor deleted successfully", { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};
