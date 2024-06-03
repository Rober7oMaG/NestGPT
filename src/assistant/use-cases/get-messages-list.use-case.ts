import OpenAI from 'openai';

interface Options {
  threadId: string;
}

export const getMessagesListUseCase = async (
  openAI: OpenAI,
  { threadId }: Options,
) => {
  const { data } = await openAI.beta.threads.messages.list(threadId);

  const messages = data.map(({ role, content }) => ({
    role,
    content: content.map(
      (messageContent) => (messageContent as any).text.value,
    ),
  }));

  return messages;
};
