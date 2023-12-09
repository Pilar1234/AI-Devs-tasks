import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {HumanMessage, SystemMessage} from "langchain/schema";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";

export async function toolsTask() {
    const token: TokenResponseType = await obtainTaskToken("tools")
    const task: TaskResponseType & { question: string } = await obtainTaskFn(token.token)

    const question: string = task.question

    const prompt: {
        systemMessage: string;
        userMessage: string
    } = {
        systemMessage:
            'Decide whether the task should be added to the ToDo list or to the calendar (if time is provided) and return the corresponding JSON.' +
            ' For reference today is 2023-11-15',
        userMessage: question
    }

    const model = new ChatOpenAI({
        modelName: "gpt-4-0613",
    }).bind({functions: [intentSchema]});

    const result = await model.invoke([
        new HumanMessage(prompt.userMessage),
        new SystemMessage(prompt.systemMessage)
    ])

    const response: { toold: 'ToDo' | 'Calendar', desc: string, date?: string } = JSON.parse(result.content)

    console.log(response)

    await sendAnswerFn(token.token, response)
}

const intentSchema = {
    name: 'describe_intention',
    description: `Describe intention based on his latest message and details from summary of their conversation.`,
    parameters: {
        type: 'object',
        properties: {
            tool: {
                type: 'string',
                format: 'ToDo|Calendar',
                description: `
                  Type has to be set to either:
                  'ToDo'.
                  'Calendar'
                  `,
            },
            desc: {
                type: 'string',
                description: 'Describe the details of action'
            },
            date: {
                type: 'string',
                format: 'date',
                description: 'Optional parameter for calendar type in format yyyy-MM-DD'
            }
        },
    },
}