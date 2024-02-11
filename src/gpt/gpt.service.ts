import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
} from './use-cases';
import { OrthographyDTO, ProsConsDiscusserDTO } from './dtos';

@Injectable()
export class GptService {
  private openAI = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  async orthographyCheck(orthographyDTO: OrthographyDTO) {
    return await orthographyCheckUseCase(this.openAI, {
      prompt: orthographyDTO.prompt,
    });
  }

  async prosConsDiscusser({ prompt }: ProsConsDiscusserDTO) {
    return await prosConsDiscusserUseCase(this.openAI, { prompt });
  }

  async prosConsDiscusserStream({ prompt }: ProsConsDiscusserDTO) {
    return await prosConsDiscusserStreamUseCase(this.openAI, { prompt });
  }
}
