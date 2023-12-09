import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {OpenAIAPIWrapper} from "../common/OpenAIAPIWrapper";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";
import {ChatCompletion} from "openai/resources";

export async function bloggerTask() {
    const token: TokenResponseType = await obtainTaskToken("blogger")
    const task: TaskResponseType & { blog: string[] } = await obtainTaskFn(token.token)
    const blogParagraphs: string[] = task.blog

    const prompt: {
        systemMessage: string;
        userMessage: string
    } = {
        systemMessage:
            'Napisz przepis kulinarny. Opisz czynnosci nawiazyjac do rozdzialow podanych przez uzytkownika' +
            'Zwroc odpowiedz w formie JSON. Kazdy opis rozdzialu to jeden obiekt JSON {"title","description"} zawarty w tablicy',

        userMessage: blogParagraphs[0] +
            ". Rozdzial 1: " + blogParagraphs[1] +
            ". Rozdzial 2: " + blogParagraphs[2] +
            ". Rozdzial 3: " + blogParagraphs[3]
    }
    const response: ChatCompletion = await new OpenAIAPIWrapper().sendMessage1(prompt);

    const receipt: {
        title: string, description: string
    }[] = JSON.parse(<string>response.choices[0].message.content)
    console.log(receipt)


    const receiptParagraphs: string[] = receipt.map(value => value.description)
    await sendAnswerFn(token.token, receiptParagraphs)
}