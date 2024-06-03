import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (
  openAI: OpenAI,
  { threadId, assistantId = process.env.OPEN_AI_ASSISTANT_ID }: Options,
) => {
  return await openAI.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });
};
