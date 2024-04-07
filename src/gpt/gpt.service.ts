import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  textToAudioGetterUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  OrthographyDTO,
  ProsConsDiscusserDTO,
  TextToAudioDTO,
  TranslateDTO,
} from './dtos';

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

  async translate({ prompt, language }: TranslateDTO) {
    return await translateUseCase(this.openAI, { prompt, language });
  }

  async textToAudioGetter(fileId: string) {
    return await textToAudioGetterUseCase(fileId);
  }

  async textToAudio({ prompt, voice }: TextToAudioDTO) {
    return await textToAudioUseCase(this.openAI, { prompt, voice });
  }
}
