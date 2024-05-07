import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  getAudioByIdUseCase,
  textToAudioUseCase,
  translateUseCase,
  getImageByNameUseCase,
  imageVariationUseCase,
} from './use-cases';
import {
  AudioToTextDTO,
  ImageGenerationDTO,
  ImageVariationDTO,
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

  async getAudioById(fileId: string) {
    return await getAudioByIdUseCase(fileId);
  }

  async textToAudio({ prompt, voice }: TextToAudioDTO) {
    return await textToAudioUseCase(this.openAI, { prompt, voice });
  }

  async audioToText(
    audioFile: Express.Multer.File,
    { prompt }: AudioToTextDTO,
  ) {
    return await audioToTextUseCase(this.openAI, { audioFile, prompt });
  }

  async getImageByName(fileName: string) {
    return await getImageByNameUseCase(fileName);
  }

  async imageGeneration(imageGenerationDTO: ImageGenerationDTO) {
    return await imageGenerationUseCase(this.openAI, { ...imageGenerationDTO });
  }

  async imageVariation({ baseImage }: ImageVariationDTO) {
    return await imageVariationUseCase(this.openAI, { baseImage });
  }
}
