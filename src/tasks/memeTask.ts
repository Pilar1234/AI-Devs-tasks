import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import axios, {AxiosResponse} from "axios";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";

export async function memeTask() {
    const token: TokenResponseType = await obtainTaskToken("meme")
    const task: TaskResponseType & { image: string, text: string } = await obtainTaskFn(token.token)
    axios.defaults.headers.common['x-api-key'] = process.env.RENDERFORM_API_KEY

    const response: AxiosResponse<{
        requestId: string,
        href: string
    }> = await axios.post('https://api.renderform.io/api/v2/render', {
            template: "hairy-sharks-howl-promptly-1704",
            data: {
                "title.text": task.text,
                "image.src": task.image
            }
        }
    )

    await sendAnswerFn(token.token, response.data.href)
}