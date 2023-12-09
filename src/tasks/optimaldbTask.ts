import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import fs from 'fs';
import {OpenAIAPIWrapper} from "../common/OpenAIAPIWrapper";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";

export async function optimaldbTask() {
    const token: TokenResponseType = await obtainTaskToken("optimaldb")
    const task: TaskResponseType = await obtainTaskFn(token.token)

    const people: {
        zygfryd: string[]
        stefan: string[]
        ania: string[]
    } = JSON.parse(fs.readFileSync('./3friends.json', 'utf-8'));

    const prompt: {
        systemMessage: string;
        userMessage: string
    } = {
        systemMessage:
            'Prosze zoptymalizuj podany przeze mnie string aby wciaz zawieral wszystkie wazne informacje',
        userMessage: people.stefan.toString()
    }
    const response = await new OpenAIAPIWrapper().sendMessage1(prompt, {model: 'gpt-3.5-turbo'})

    console.log(response.choices[0].message)
    const peopleOptimised: {
        zygfryd: string[]
        stefan: string[]
        ania: string[]
    } = JSON.parse(fs.readFileSync('./3friends_optimised.json', 'utf-8'));

    await sendAnswerFn(token.token, peopleOptimised.zygfryd.toString() + peopleOptimised.stefan.toString() + peopleOptimised.ania.toString())
}