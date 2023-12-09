import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import {OpenAIAPIWrapper} from "../common/OpenAIAPIWrapper";
import axios, {AxiosResponse} from "axios";
import fs from 'fs';

export async function knowledgeTask() {
    const token: TokenResponseType = await obtainTaskToken("knowledge")
    const task: TaskResponseType & { question: string } = await obtainTaskFn(token.token)

    const prompt: {
        systemMessage: string;
        userMessage: string
    } = {
        systemMessage:
            'I will ask you a question about the exchange rate, the current population or general knowledge. ' +
            ' It has to be for year 2023' +
            'Be concise, if you dont know the answer respond "error"',
        userMessage: task.question
    }

    const currency: AxiosResponse<{
        table: string,
        no: string,
        effectiveDate: string,
        rates: { rate: { currency: string, code: string, mid: number } }[]
    }[]> = await axios.get('http://api.nbp.pl/api/exchangerates/tables/A/');
    const knowledge: AxiosResponse<{
        name: {},
        population: number
    }> = await axios.get('https://restcountries.com/v3.1/all?fields=name,population');

    // contains data about currency and population of countries
    // console.log({...currency.data, ...knowledge.data})
    await writeToFile('fine-tuning-data.jsonl', {...currency.data, ...knowledge.data})
    // await writeToFile('knowledge.json', knowledge.data)

    const currencyID: string = await uploadFile("./fine-tuning-data.jsonl")
    // const knowledgeID: string = await uploadFile("./knowledge.json")
    // await makeFineTune(currencyID)
    // await makeFineTune(knowledgeID)


    // const response = await makeFineTune(currencyID)
    // console.log(response)
    // const response1 = await new OpenAIAPIWrapper().sendMessage1(prompt, {model: response});
    // console.log(currency.data[0].rates)
    // console.log(knowledge.data)

    // await sendAnswerFn(token.token, '4.3767')
}

function writeToFile(fileName: string, data: any) {
    fs.writeFile(fileName, JSON.stringify(data), err => {
        if (err) {
            console.log('Error writing file:', err);
        } else {
            console.log('Successfully wrote file');
        }
    })
}

async function uploadFile(fileName: string) {
    const f = await new OpenAIAPIWrapper().openai.files.create({
        file: fs.createReadStream(fileName),
        purpose: 'fine-tune'
    });
    return f.id;
}

async function makeFineTune(fileId: string) {
    const ft = await new OpenAIAPIWrapper().openai.fineTunes.create({training_file: fileId, model: 'gpt-4'});
    return ft.id;
}

async function getFineTunedModelName() {
    const modelName = await new OpenAIAPIWrapper().openai.fineTunes.list();
    return modelName.data[0].fine_tuned_model;
}