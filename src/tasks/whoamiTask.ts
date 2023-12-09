import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";
import {OpenAIAPIWrapper} from "../common/OpenAIAPIWrapper";
import {MemoryVectorStore} from "langchain/dist/vectorstores/memory";
import {Document} from "langchain/document";
import {OpenAIEmbeddings} from "langchain/dist/embeddings/openai";

export async function whoamiTask() {
    let token: TokenResponseType = await obtainTaskToken("whoami")

    const task: TaskResponseType & { hint: string } = await obtainTaskFn(token.token)

    if (task.code === -2 || token.msg === "no apikey provided") {
        token = await obtainTaskToken("whoami")
    }

    let response = await helper()
    const answer = await sendAnswerFn(token.token, response.choices[0].message.content);
    if (answer.code == 0) {
        return;
    }

    if (answer.code === -777 || answer.msg === 'this is NOT the correct answer') {
        let response = await helper()
        await sendAnswerFn(token.token, response.choices[0].message.content);
    }
}

async function helper() {
    let token: TokenResponseType = await obtainTaskToken("whoami")

    const task: TaskResponseType & { hint: string } = await obtainTaskFn(token.token)

    let response = await new OpenAIAPIWrapper().sendMessage({
        systemMessage: 'Jesli nie znasz odpowiedzi zwroc precyzyjnie "nie wiem"',
        assistantMessage: 'Zgadnij kim jestem.',
        userMessage: task.hint
    })

    // TODO: store hints somehow to keep context of conversation
    if (response.choices[0].message.content?.includes("Nie wiem")) {
        const vectorStore = await MemoryVectorStore.fromDocuments(
            [
                new Document({pageContent: task.hint})
            ],
            new OpenAIEmbeddings())
        response = await helper()
    }
    return response;
}