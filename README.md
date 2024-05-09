<h1 align="center">LLM-Chat 🤖</h1>

<p align="center">
  A sophisticated conversational AI web application powered by Mistral LLM.
</p>

<p align="center">
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#features">Features</a> •
  <a href="#setup">Setup</a> •
  <a href="#usage">Usage</a> •
  <a href="#contributors">Contributors</a> •
  <a href="#license">License</a>
</p>

---

## Tech Stack 🛠️

- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs without writing CSS.
- **Mistral LLM**: A Large Language Model developed for natural language processing tasks, providing conversational abilities.
- **Langchain**: A library for natural language processing, providing text processing capabilities such as tokenization and encoding.
- **Pinecone DB**: A vector database for storing and querying vector embeddings efficiently.
- **PostgreSQL**: A powerful, open-source relational database system.
- **Drizzle**: A toolkit for building SQL-based APIs and managing database schemas.

## Features 🚀

- **File Upload and Analysis**: Upload a file and receive relevant answers from the content of the file.
- **No Hallucinations**: Ensure that the AI assistant provides accurate responses without generating hallucinated content.
- **Fast and Accurate Answers**: Receive fast and accurate responses from the AI assistant, powered by Mistral LLM.
- **Data Security**: Maintain data security and confidentiality while interacting with the AI assistant and storing data in the PostgreSQL database.

## Setup 🛠️

1. **Clone the Repository**: `git clone https://github.com/your-username/llm-chat.git`
2. **Install Dependencies**: `cd llm-chat` then `npm install` or `yarn install`
3. **Set Up Environment Variables**: Create a `.env.local` file and add the following environment variables:
   - `DATABASE_URL_NEON`: URL for connecting to the PostgreSQL database.
   - `PINECONE_API_KEY`: API key for accessing the Pinecone DB API.
   - `MISTRAL_API_KEY`: API key for accessing the Mistral LLM API.
4. **Run the Application**: `npm run dev` or `yarn dev`
5. **Access the Application**: Open your browser and navigate to `http://localhost:3000`

## Usage 📋

Once the application is running, visit the provided URL (`http://localhost:3000` by default) to access the chat interface. Upload a file using the provided interface and receive relevant answers from the content of the file. Ensure that the AI assistant provides fast, accurate, and secure responses without hallucinations.

## Contributors 👨‍💻

- [Vitthal Gund](https://github.com/VitthalGund)

## License 📝

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
