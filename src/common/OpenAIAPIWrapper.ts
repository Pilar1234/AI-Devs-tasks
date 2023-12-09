import OpenAIApi, {OpenAI} from "openai";
import ChatCompletion = OpenAI.ChatCompletion;
import axios from "axios";

export class OpenAIAPIWrapper {
    public readonly openaiApi: OpenAIApi;
    public readonly openai: OpenAI;

    constructor() {
        this.openaiApi = new OpenAIApi({apiKey: process.env.OPENAI_API_KEY});
        this.openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    }

    async sendMessage(message: { systemMessage: string; userMessage: string; assistantMessage: string }, options: {
        model: "gpt-4" | "gpt-4-0314" | "gpt-4-0613" | "gpt-4-32k" | "gpt-4-32k-0314" | "gpt-4-32k-0613" | "gpt-3.5-turbo" | "gpt-3.5-turbo-16k" | "gpt-3.5-turbo-0301" | "gpt-3.5-turbo-0613" | "gpt-3.5-turbo-16k-0613"
    } = {model: 'gpt-4'}): Promise<ChatCompletion> {
        return this.openaiApi.chat.completions.create({
            model: options.model,
            messages: [
                {content: message.systemMessage, role: 'system'},
                {content: message.assistantMessage, role: 'assistant'},
                {content: message.userMessage, role: 'user'},
            ],
        });
    }

    async sendMessage1(message: { systemMessage: string; userMessage: string }, options: {
        model: string | "gpt-4" | "gpt-4-0314" |  "gpt-4-0613" | "gpt-4-32k" | "gpt-4-32k-0314" | "gpt-4-32k-0613" | "gpt-3.5-turbo" | "gpt-3.5-turbo-16k" | "gpt-3.5-turbo-0301" | "gpt-3.5-turbo-0613" | "gpt-3.5-turbo-16k-0613"
    } = {model: 'gpt-4'}): Promise<ChatCompletion> {
        return this.openaiApi.chat.completions.create({
            model: options.model,
            messages: [
                {content: message.systemMessage, role: 'system'},
                {content: message.userMessage, role: 'user'},
            ],
        });
    }

    async sendImage(imageUrl: string) {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'I will give you a drawing of a gnome with a hat on his head. Tell me what is the color of the hat in POLISH. If any errors occur, return "ERROR" as answer'
                            },
                            {type: 'image_url', image_url: {url: imageUrl}},
                        ],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );
        console.log(response.data.choices[0])
        return response.data.choices[0].message.content;
    }
}