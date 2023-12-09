import {TokenResponseType} from "../common/types/TokenResponseType";
import {obtainTaskToken} from "../common/aidevs/obtainTokenFn";
import {TaskResponseType} from "../common/types/TaskResponseType";
import {obtainTaskFn} from "../common/aidevs/obtainTaskFn";
import {UnknownNewsType} from "../common/types/unkownNewsType";
import {Document} from "langchain/document";
import {v4 as uuidv4} from 'uuid';
import * as fs from 'fs';
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {sendAnswerFn} from "../common/aidevs/sendAnswerFn";
import {generateEmbeddingsFn} from "../common/generateEmbeddingsFn";
import {qdrantClient} from "../common/constants";


// docker pull qdrant/qdrant
// docker run -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant

const COLLECTION_NAME: string = 'unknownNews'

export async function searchTask() {
    const embeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY, maxConcurrency: 5});
    let token: TokenResponseType = await obtainTaskToken("search")

    const task: TaskResponseType & { question: string } = await obtainTaskFn(token.token)

    const result = await qdrantClient.getCollections();

    const collectionNames = result.collections.map((collection) => collection.name);

    if (!collectionNames.includes(COLLECTION_NAME)) {
        const create = await qdrantClient.createCollection(COLLECTION_NAME, {
            vectors: {
                size: 1536,
                distance: 'Cosine',
                on_disk: true
            }
        });
        await insertDocuments();
    }

    const [queryEmbedding] = await embeddings.embedDocuments([task.question]);

    const search:{
        id: string | number;
        version: number;
        score: number;
        payload?: Record<string, unknown> | null | UnknownNewsType;
        vector?: Record<string, unknown> | number[] | { [p: string]: number[] | undefined } | null | undefined
    }[]  = await qdrantClient.search(COLLECTION_NAME, {
        vector: queryEmbedding,
        limit: 1,
        filter: {
            must: [
                {
                    key: 'source',
                    match: {
                        value: COLLECTION_NAME
                    }
                }
            ]
        }
    });
    const finalAnswer = await sendAnswerFn(token.token, search[0].payload?.url)
}

async function insertDocuments() {
    const unknownNewsList: UnknownNewsType[] = JSON.parse(fs.readFileSync('./unknowNews.json', 'utf-8'));

    let documents = unknownNewsList.map(news => {
        return new Document({
            pageContent: news.title,
            metadata: {uuid: uuidv4(), info: news.info, url: news.url, date: news.date, source: COLLECTION_NAME}
        })
    })

    const points = await generateEmbeddingsFn(documents)

    await qdrantClient.upsert(COLLECTION_NAME, {
        wait: true,
        batch: {
            ids: points.map(point => point.id),
            vectors: points.map(point => point.vector),
            payloads: points.map(point => point.payload)
        }
    })
}