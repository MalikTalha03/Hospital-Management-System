import { storage, db } from "@/utils/db";
import { Readable } from "stream";

export const POST = async (req, { params }) => {
  const { id } = params;
  const data = await req.formData();
  const document = data.get("file");
  const reportName = data.get("reportName");
  const description = data.get("description");

  try {
    const bucket = storage.bucket();
    const fileRef = bucket.file(`ehr/${id}/${document.name}`); // Use originalFilename if available

    const bufferStream = Readable.from(document.stream()); // Assuming the document object supports stream()

    await fileRef.save(bufferStream, {
      metadata: {
        contentType: document.type, // Make sure this is defined
      },
    });

    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-17-2025",
    });

    // Update Firestore or your database as needed
    const ehrRef = db.collection("ehr").doc();
    await ehrRef.set({
      patientId: id,
      reportName,
      description,
      fileUrl: url,
      fileName: document.name,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "EHR record created successfully" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const GET = async (req, { params }) => {
  const { id } = params;
  try {
    const ehrRef = db.collection("ehr").where("patientId", "==", id);
    const snapshot = await ehrRef.get();
    const data = snapshot.docs.map((doc) => ({ eid: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
};
