import OpenAI from 'openai';

type Options = {
  prompt: string;
};

export const orthographyCheckUseCase = async (
  openAI: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openAI.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          You will be provided with texts in English that may contain grammatical and orthographic errors. 
          
          Your task is to correct the errors and make the text grammatically and orthographically correct, and also to give a percentage of the text's correctness. If there are no errors in the text, you should return a congratulations message.

          Your response must be in JSON format.
          Here is an example of how to structure your response:
          {
            "userScore": number,
            "errors": string[], // ['error -> correction', ...]
            "message": string,
          }
        `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo-1106',
    temperature: 0.3,
    max_tokens: 150,
    //* This may be invalid in certain models
    response_format: {
      type: 'json_object',
    },
  });

  const jsonResponse = JSON.parse(completion.choices[0].message.content);

  return jsonResponse;
};
