import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API Key');
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const imageModel = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });

    try {
        const result = await imageModel.generateContent('A cute cat');
        console.log(JSON.stringify(result.response, null, 2));
    } catch (e: any) {
        console.error(e.message);
    }
}
run();
