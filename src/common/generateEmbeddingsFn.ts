import {OpenAIEmbeddings} from "langchain/embeddings/openai";

export async function generateEmbeddingsFn(documents: { pageContent: string, metadata: any }[]) {
    const embeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY, maxConcurrency: 5});
    const points = [];
    for (const document of documents) {
        const [embedding] = await embeddings.embedDocuments([document.pageContent]);
        points.push({
            id: document.metadata.uuid,
            payload: document.metadata,
            vector: embedding,
        });
    }

    return points;
}