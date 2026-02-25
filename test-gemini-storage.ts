import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

async function run() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
        console.error('No API Key');
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const imageModel = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });
    try {
        const result = await imageModel.generateContent('A cute cat in a hat');
        const candidates = result.response.candidates;
        if (!candidates || candidates.length === 0) throw Error('No candidates');

        const base64Image = candidates[0].content.parts[0].inlineData?.data;
        if (!base64Image) throw Error('No base64 data');

        const buffer = Buffer.from(base64Image, 'base64');
        const fileName = uuidv4() + '.jpeg';
        const filePath = path.join(process.cwd(), 'uploads', 'webtoons', fileName);

        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(filePath, buffer);
        console.log('Successfully saved to', filePath);
    } catch (e: any) {
        console.error(e.message);
    }
}
run();
