import OpenAIAPI from "openai";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import axios, {AxiosResponse} from "axios";
import {Transcription} from "openai/resources/audio";
import * as fs1 from "fs";
import fs from 'fs/promises';
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";
import {TokenResponseType} from "../common/types/TokenResponseType";
const aiDevsTask = 'https://zadania.aidevs.pl/task/'

export async function whisperTask() {
    const regex = /(https?:\/\/[^\s]+\.mp3)/i;

    const openai: OpenAIAPI = new OpenAIAPI({apiKey: process.env.OPENAI_API_KEY})
    const token: TokenResponseType = await obtainTaskToken("whisper")
    const task: string = await axios.post(aiDevsTask + token)
        .then((response: AxiosResponse<{ code: number, msg: string, input: string }>) => {
            console.log('Otrzymana odpowiedz z /task:', response.data);
            return response.data.msg;
        })

    const message = task.match(regex)

    let audioUrl: string = "";
    if (message) {
        audioUrl = message[0]
    }
    const response1 = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const fileData = Buffer.from(response1.data, 'binary');
    await fs.writeFile('./audio.mp3', fileData);
    const response: Transcription = await openai.audio.transcriptions.create(
        {
            file: fs1.createReadStream('./audio.mp3'),
            model: "whisper-1"
        }
    )
    console.log("transcriptions: ", response)
    await sendAnswerFn(token.token, response.text);
}