import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import {ChatCompletion} from "openai/resources";
import {OpenAIAPIWrapper} from "../common/OpenAIAPIWrapper";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";

export async function inPromptTask() {
    const token: TokenResponseType = await obtainTaskToken("inprompt")
    const task: TaskResponseType & { input: string[], question: string } = await obtainTaskFn(token.token)

    const personList: { name: string, description: string }[] = task.input.map(value => {
        const words: string[] = value.split(' ')
        const description: string = words.join(' ')
        return {name: words[0], description: description}
    })

    const prompt: {
        systemMessage: string;
        userMessage: string
    } = {
        systemMessage: 'Zwrot z podanego pytania tylko imie',
        userMessage: task.question
    }
    const response: ChatCompletion = await new OpenAIAPIWrapper().sendMessage1(prompt);

    const extractedName: string | null = response.choices[0].message.content

    const person = personList.find(person => person.name === extractedName)

    await sendAnswerFn(token.token, person?.description)
}