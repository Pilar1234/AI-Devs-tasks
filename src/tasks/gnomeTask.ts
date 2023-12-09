import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import OpenAIApi from "openai/index";
import {OpenAIAPIWrapper} from "../common/OpenAIAPIWrapper";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";

export async function gnomeTask() {
    const token: TokenResponseType = await obtainTaskToken("gnome")
    const task: TaskResponseType & { url: string } = await obtainTaskFn(token.token)

    const prompt: {
        systemMessage: string;
        userMessage: string
    } = {
        systemMessage:
            'Describe what is the color of a gnome hat. If you cant recognise gnome on the picture respond with "error"',
        userMessage: ''
    }

    const response: string = await new OpenAIAPIWrapper().sendImage(task.url)

    await sendAnswerFn(token.token, response)
}