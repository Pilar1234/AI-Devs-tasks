import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";

export async function main() {
    const token: TokenResponseType = await obtainTaskToken('helloapi')

    const task: TaskResponseType & { cookie: string } = await obtainTaskFn(token.token)

    await sendAnswerFn(token.token, task.cookie)
}
