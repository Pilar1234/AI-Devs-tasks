import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import axios, {AxiosResponse} from "axios";
import {PromptTemplate} from "langchain/prompts";
import {ChatOpenAI} from "langchain/chat_models/openai";
import * as readline from 'node:readline/promises';
import {LLMChain} from "langchain/chains";
import {stdin as input, stdout as output} from 'node:process';
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";
import {TokenResponseType} from "../common/types/TokenResponseType";

const aiDevsTask = 'https://zadania.aidevs.pl/task/'

async function promptUser() {
    const rl = readline.createInterface({ input, output });
    const question = await rl.question('What is your name? ');
    console.log(`Question to validate is: ${question}!`);
    rl.close();
    return question;
}

export async function liarTask() {
    const question: string = await promptUser();
    const token: TokenResponseType = await obtainTaskToken("liar")

    const formData = new FormData()
    formData.append("question", question)

    const apiAnswer: AxiosResponse<{
        code: number,
        msg: string,
        answer: string
    }> = await axios.post(aiDevsTask + token, formData)

    console.log("The answer for question is: ", apiAnswer.data.answer)
    const guardPrompt = PromptTemplate.fromTemplate(
        "Please provide an answer to following question: {question} validate the question against this statement {validation}. " +
        "Reply with 'Yes' if statement is correct answer to the question or 'No' if statement is not valid")

    const chat = new ChatOpenAI();

    const chain = new LLMChain({llm: chat, prompt: guardPrompt})
    const result = await chain.call({
        question,
        validation: apiAnswer.data.answer,
    })

    console.log("Result from chat: ", {result}.result.text)

    const finalAnswer = await sendAnswerFn(token.token, {result}.result.text)
}