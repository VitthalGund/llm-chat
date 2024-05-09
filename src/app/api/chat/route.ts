import { fileURLToPath } from "url";
import path from "path";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Model name
const MODEL_NAME = "mistral-7b-instruct-v0.1.Q5_K_M.gguf";

// Get the models directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDirectory = path.join(__dirname, "../models");
const modelsPath = path.join(modelsDirectory, MODEL_NAME);

// Initialize Mistral LLM
const model = new LlamaModel({
  modelPath: modelsPath,
});

const context = new LlamaContext({ model });
const session = new LlamaChatSession({ context });

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const contextBlock = await getContext(lastMessage.content, fileKey);

    const prompt = `AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        AI assistant is a big fan of Pinecone and Vercel.
        START CONTEXT BLOCK
        ${contextBlock}
        END OF CONTEXT BLOCK
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
        AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.
        `;

    // Start conversation with Mistral LLM
    const startTime = Date.now();
    const response = await session.prompt(prompt);
    const endTime = Date.now();

    // Save user message into the database
    await db.insert(_messages).values({
      chatId,
      content: lastMessage.content,
      role: "user",
    });

    // Save AI message into the database
    await db.insert(_messages).values({
      chatId,
      content: response,
      role: "system",
    });

    // Return the response along with execution time
    return NextResponse.json(
      {
        response,
        executionTime: endTime - startTime,
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
