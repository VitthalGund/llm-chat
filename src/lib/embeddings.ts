import { LlamaModel, LlamaContext } from "node-llama-cpp";
import { fileURLToPath } from "url";
import path from "path";

// Model name
const MODEL_NAME = "mistral-7b-instruct-v0.1.Q2_K.gguf";

// Get the models directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDirectory = path.join(__dirname, "../../../models");
const modelsPath = path.join(modelsDirectory, MODEL_NAME);

// Initialize the Llama model
const model = new LlamaModel({
  modelPath: modelsPath,
});

// Create a new context
const context = new LlamaContext({ model });

// Function to generate embeddings using Mistral LLM
export async function getEmbeddings(text: string) {
  try {
    // Generate embeddings
    const embeddings = context.encode(text);
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}
