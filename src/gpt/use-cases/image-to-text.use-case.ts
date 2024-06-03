import OpenAI from 'openai';
import { convertImageToBase64 } from 'src/helpers';

interface Options {
  prompt?: string;
  imageFile: Express.Multer.File;
}

export const imageToTextUseCase = async (
  openAI: OpenAI,
  { imageFile, prompt }: Options,
) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4-vision-preview',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt ?? 'What can you see in this image?',
          },
          {
            type: 'image_url',
            image_url: {
              url: convertImageToBase64(imageFile),
            },
          },
        ],
      },
    ],
  });

  return { message: response.choices[0].message.content };
};
