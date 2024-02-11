import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscusserUseCase = async (
  openAI: OpenAI,
  { prompt }: Options,
) => {
  const completion = await openAI.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          You will be given a question, and your task is to provide a list of pros and cons for it. Your answer (pros and cons) must be on a list, in Markdown format.
        `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo-1106',
    temperature: 0.6,
    max_tokens: 500,
  });

  return completion.choices[0].message;
};
