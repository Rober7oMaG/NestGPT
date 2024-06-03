import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openAI: OpenAI,
  options: Options,
) => {
  const { threadId, runId } = options;

  const { status } = await openAI.beta.threads.runs.retrieve(threadId, runId);

  if (status === 'completed') return status;

  // Delay two seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return await checkCompleteStatusUseCase(openAI, options);
};
