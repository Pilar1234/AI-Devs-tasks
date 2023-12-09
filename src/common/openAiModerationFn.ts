import {ModerationCreateResponse} from "openai/resources/moderations";
import {OpenAIAPIWrapper} from "./OpenAIAPIWrapper";

export function sendDataToModerationFn(sentence: string): Promise<ModerationCreateResponse> {
    return new OpenAIAPIWrapper().openaiApi.moderations.create({input: sentence})
}