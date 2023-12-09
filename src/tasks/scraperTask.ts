import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import {TokenResponseType} from "../common/types/TokenResponseType";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {stripHtml} from "../common/stripHtmlFn";
import OpenAIApi, {OpenAI} from "openai";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";
import {Retry} from "../getPageContent";
import ChatCompletion = OpenAI.ChatCompletion;

export async function scraperTask() {
    const openai: OpenAIApi = new OpenAIApi({apiKey: process.env.OPENAI_API_KEY})
    const token: TokenResponseType = await obtainTaskToken("scraper")

    const task: TaskResponseType & { input: string; question: string } = await obtainTaskFn(token.token)

    const pageContent = await Retry.getPageContent(task.input)
    const strippedPageContent: string = stripHtml(pageContent)

    const response: ChatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {content: strippedPageContent, role: 'system'},
            {content: task.question, role: 'user'},
        ],
    })
    console.log(response.choices[0].message)

    const answer = await sendAnswerFn(token.token, response.choices[0].message.content);
}