import OpenAI from 'openai';
import * as fs from 'fs';
import { downloadBase64ImageAsPNG, downloadImageAsPNG } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openAI: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  if (!originalImage || !maskImage) {
    const response = await openAI.images.generate({
      prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const fileName = await downloadImageAsPNG(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url,
      responseUrl: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  const originalImagePath = await downloadImageAsPNG(originalImage, true);
  const maskImagePath = await downloadBase64ImageAsPNG(maskImage, true);

  const response = await openAI.images.edit({
    model: 'dall-e-2',
    prompt,
    image: fs.createReadStream(originalImagePath),
    mask: fs.createReadStream(maskImagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const fileName = await downloadImageAsPNG(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    responseUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
