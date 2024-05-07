import OpenAI from 'openai';
import * as fs from 'fs';
import { downloadImageAsPNG } from 'src/helpers';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openAI: OpenAI,
  { baseImage }: Options,
) => {
  const imagePath = await downloadImageAsPNG(baseImage, true);

  const response = await openAI.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(imagePath),
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
