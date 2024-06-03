import OpenAI from 'openai';

export const createThreadUseCase = async (openAI: OpenAI) => {
  const { id } = await openAI.beta.threads.create();
  return { id };
};
