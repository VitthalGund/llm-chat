import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

export const getPineconeClient = () => {
  return new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type Document = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string, file: any) {
  // Extract text content from the file (you may need to adjust this based on your file type)
  const textContent = file.toString();

  // Prepare Pinecone record
  const pineconeRecord: PineconeRecord = await embedDocument(textContent);

  // Upload embeddings to Pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("chatpdf"); // Adjust index name if needed
  const namespace = pineconeIndex.namespace(fileKey); // Use fileKey as namespace

  await namespace.upsert([pineconeRecord]);

  return pineconeRecord.id; // Return unique ID of the document
}
export async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = convertToAscii(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber as number,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("Error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(fileContent: string) {
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    {
      pageContent: fileContent,
      metadata: {
        loc: { pageNumber: 1 },
      },
    },
  ]);
  return docs;
}
