import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import fs from "fs";
import {PeopleType} from "../common/types/PeopleType";
import {OpenAIAPIWrapper} from "../common/OpenAIAPIWrapper";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";

export async function peopleTask() {
    const token: TokenResponseType = await obtainTaskToken("people")
    const task: TokenResponseType & {
        data: string,
        question: string,
        hint1: string,
        hint2: string
    } = await obtainTaskFn(token.token)

    const data = await convertData()

    let response = await new OpenAIAPIWrapper().sendMessage1({
        systemMessage: 'Wyekstraktuj z pytania imie i nazwisko i zwroc je w formie "imie:nazwisko". Nie zwracaj nic wiecej',
        userMessage: task.question
    })
    const key: string | null = response.choices[0].message.content

    const answer: { nameSurname: string; answers: string } | undefined = data.find(value => value.nameSurname === key)

    const finalAnswer = await sendAnswerFn(token.token, answer?.answers)
}

async function convertData() {
    const peopleList: PeopleType[] = JSON.parse(fs.readFileSync('./people.json', 'utf-8'));

    const data: { nameSurname: string, answers: string }[] = peopleList.map(person => {
        const key: string = person.imie + ':' + person.nazwisko
        const answers: string = person.o_mnie + '. ulubiony kolor ' + person.ulubiony_kolor
        return {nameSurname: key, answers}
    })
    return data;
}