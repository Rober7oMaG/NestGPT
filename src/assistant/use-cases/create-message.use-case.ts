import OpenAI from 'openai';

interface Options {
  threadId: string;
  question: string;
}

export const createMessageUseCase = async (
  openAI: OpenAI,
  { threadId, question }: Options,
) => {
  return openAI.beta.threads.messages.create(threadId, {
    role: 'user',
    content: question,
  });
};
