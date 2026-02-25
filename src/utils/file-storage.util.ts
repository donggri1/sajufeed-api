import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileStorageUtil {
    private readonly logger = new Logger(FileStorageUtil.name);
    private readonly uploadDir = path.join(process.cwd(), 'uploads', 'webtoons');

    constructor() {
        // Ensure the upload directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    /**
     * Saves a buffer to the local filesystem and returns the URL path.
     * @param buffer The image buffer
     * @param extension The file extension (e.g., 'png')
     * @returns The relative URL path to access the image (e.g., '/uploads/webtoons/uuid.png')
     */
    async saveBuffer(buffer: Buffer, extension: string = 'png'): Promise<string> {
        try {
            const fileName = `${uuidv4()}.${extension}`;
            const filePath = path.join(this.uploadDir, fileName);
            await fs.promises.writeFile(filePath, buffer);
            this.logger.log(`Image saved locally: ${filePath}`);

            // Return the path relative to the static serving root
            return `/uploads/webtoons/${fileName}`;
        } catch (error) {
            this.logger.error(`Error saving image: ${error.message}`);
            throw error;
        }
    }

    /**
     * Downloads an image from a URL and saves it locally.
     * @param url The URL of the image
     * @returns The relative URL path to access the image
     */
    async saveFromUrl(url: string): Promise<string> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return this.saveBuffer(buffer, 'png'); // OpenAi usually generates PNGs
        } catch (error) {
            this.logger.error(`Error saving image from URL: ${error.message}`);
            throw error;
        }
    }

    /**
     * Saves a base64 encoded image string locally.
     * @param base64String The base64 encoded image string
     * @returns The relative URL path to access the image
     */
    async saveFromBase64(base64String: string): Promise<string> {
        try {
            const buffer = Buffer.from(base64String, 'base64');
            return this.saveBuffer(buffer, 'jpeg'); // Gemini base64 image is often jpeg
        } catch (error) {
            this.logger.error(`Error saving image from Base64: ${error.message}`);
            throw error;
        }
    }
}
