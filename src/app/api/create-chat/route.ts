import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: any, res: any) {
  // Adjust types as per Next.js Request and Response types
  try {
    // Accessing the uploaded file from req.body
    // Parse the incoming form data
    const formData = await req.formData();

    // Get the file from the form data
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const { name: file_name } = file;
    const file_key = `${Date.now()}_${file_name}`; // Generating a unique key for the file

    // Upload file to Pinecone and create chat entry in the database
    const chat_id = await loadS3IntoPinecone(file_key, file);

    // Store chat entry in the database
    const insertedChat = await db
      .insert(chats)
      .values({
        pdfName: file_name,
        pdfUrl: `/path/to/files/${file_key}`, // Update with appropriate file URL
        fileKey: file_key,
      })
      .returning("id"); // Return the ID of the inserted chat

    return NextResponse.json(
      {
        chat_id: chat_id,
        chat_entry_id: insertedChat[0].id, // Return the ID of the inserted chat entry
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
