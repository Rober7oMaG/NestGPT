import * as fs from 'fs';
import OpenAI from 'openai';

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openAI: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;

  const response = await openAI.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt, // Same language as file
    language: 'en',
    // response_format: 'vtt',
    response_format: 'verbose_json',
  });

  return response;
};
