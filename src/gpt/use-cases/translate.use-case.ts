export const translateUseCase = async (openAI, { prompt, language }) => {
  const completion = await openAI.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          Translate this text to ${language}: ${prompt}
        `,
      },
    ],
    model: 'gpt-3.5-turbo-1106',
    temperature: 0.2,
  });

  return { text: completion.choices[0].message.content };
};
