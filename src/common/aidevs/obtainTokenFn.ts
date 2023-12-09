import axios, {AxiosResponse} from "axios";
import {TokenResponseType} from "../types/TokenResponseType";

const aiDevsToken = 'https://zadania.aidevs.pl/token/'

export function obtainTaskToken(taskName: string): Promise<TokenResponseType> {
    const API_KEY = process.env.AI_DEVS_KEY
    return axios.post(aiDevsToken + taskName, {"apikey": API_KEY})
        .then((response: AxiosResponse<TokenResponseType>) => {
            return response.data;
        })
}