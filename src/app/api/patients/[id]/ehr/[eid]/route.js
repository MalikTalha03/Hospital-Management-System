import { storage, db } from "@/utils/db";

export const DELETE = async (req, { params }) => {
  const { id, eid } = params;

  try {
    const docRef = db.collection("ehr").doc(eid);
    const doc = await docRef.get();

    if (!doc.exists) {
      return new Response("EHR record not found", { status: 404 });
    }

    const documentUrl = doc.data().documentUrl;
    const fileName = documentUrl.split("/").pop().split("?")[0];

    const fileRef = storage.bucket().file(`ehr/${id}/${fileName}`);

    await fileRef.delete();

    await docRef.delete();

    return new Response(
      JSON.stringify({ message: "EHR record deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to delete EHR record:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
