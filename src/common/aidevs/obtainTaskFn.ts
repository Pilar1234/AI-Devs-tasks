import axios, {AxiosResponse} from "axios";

const aiDevsTask = 'https://zadania.aidevs.pl/task/'

export function obtainTaskFn(token: string): Promise<any > {
    return axios.post(aiDevsTask + token)
        .then((response: AxiosResponse<{ code: number, msg: string, input: string[] }>) => {
            console.log('Otrzymana odpowiedz z /task:', response.data);
            return response.data;
        })
}

export function obtainTaskFnString(token: string): Promise<string> {
    return axios.post(aiDevsTask + token)
        .then((response: AxiosResponse<{ code: number, msg: string, input: string }>) => {
            console.log('Otrzymana odpowiedz z /task:', response.data);
            return response.data.input;
        })
}