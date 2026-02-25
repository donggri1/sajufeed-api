import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { OpenAiProvider } from './providers/openai.provider'; // Import 추가
import { GeminiProvider } from './providers/gemini.provider';
import { FileStorageUtil } from '../utils/file-storage.util';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'AI_PROVIDER',
            useClass: GeminiProvider,
            // useClass: OpenAiProvider, // GeminiProvider -> OpenAiProvider 교체
        },
        AiService,
        FileStorageUtil,
    ],
    exports: [AiService],
})
export class AiModule { }

