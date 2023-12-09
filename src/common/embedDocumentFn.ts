import OpenAIAPI from "openai/index";

export async function embedDocumentFn(input: string) {
    const openai: OpenAIAPI = new OpenAIAPI({apiKey: process.env.OPENAI_API_KEY})

    return openai.embeddings.create({
        input,
        model: "text-embedding-ada-002"
    });
}