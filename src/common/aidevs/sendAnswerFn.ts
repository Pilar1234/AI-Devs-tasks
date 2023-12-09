import axios, {AxiosResponse} from "axios";
import {TaskResponseType} from "../types/TaskResponseType";

export function sendAnswerFn(token: string, answer: any): Promise<TaskResponseType> {
    return axios.post("https://zadania.aidevs.pl/answer/" + token, {"answer": answer})
        .then((r: AxiosResponse<TaskResponseType>) => {
            console.log("Response from answer endpoint: ", r.data)
            if (r.data.msg == 'OK' && r.data.code == 0)
                console.log("The task has been completed successfully!")
            return r.data
        })
}