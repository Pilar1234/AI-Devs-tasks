import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {sendDataToModerationFn} from "../common/openAiModerationFn";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";
import {ModerationCreateResponse} from "openai/resources/moderations";
import {TokenResponseType} from "../common/types/TokenResponseType";

export async function moderationTask() {
    const token: TokenResponseType = await obtainTaskToken("moderation")
    const tasksData: { code: number; msg: string; input: string[] } = await obtainTaskFn(token.token)

    const requests: Promise<ModerationCreateResponse>[] = tasksData.input.map((input) => sendDataToModerationFn(input));
    const responses: Awaited<ModerationCreateResponse>[] = await Promise.all(requests);

    let values: number[] = [];
    responses.forEach((response: Awaited<ModerationCreateResponse>) => response.results[0].flagged ? values.push(1) : values.push(0))

    return sendAnswerFn(token.token, values)
        .catch((error) => console.error('General error:', error));
}

