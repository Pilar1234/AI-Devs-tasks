import OpenAIAPI from "openai";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";
import {TokenResponseType} from "../common/types/TokenResponseType";


const addUserFunctionSchema = {
    "name": "addUser",
    "description": "Adds users with a name,surname and age",
    "parameters": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "Name of the user"
            },
            "surname": {
                "type": "string",
                "description": "Surname of the user"
            },
            "year": {
                "type": "integer",
                "description": "User's age"
            }
        }
    }
}

export async function functionCallingTask() {
    const openai: OpenAIAPI = new OpenAIAPI({apiKey: process.env.OPENAI_API_KEY})
    const token: TokenResponseType = await obtainTaskToken("functions")

    const finalAnswer = await sendAnswerFn(token.token, addUserFunctionSchema)
}