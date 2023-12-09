import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {OpenAI} from "openai";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";
import {TokenResponseType} from "../common/types/TokenResponseType";
import {embedDocumentFn} from "../common/embedDocumentFn";
import CreateEmbeddingResponse = OpenAI.CreateEmbeddingResponse;

export async function embeddingTask() {
    const token: TokenResponseType = await obtainTaskToken("embedding")
    const response: CreateEmbeddingResponse = await embedDocumentFn("Hawaiian pizza")

    console.log("Embeddings: ", response.data[0].embedding)

    const finalAnswer = await sendAnswerFn(token.token, response.data[0].embedding)
}