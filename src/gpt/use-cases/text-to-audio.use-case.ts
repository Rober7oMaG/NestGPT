import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (
  openAI: OpenAI,
  { prompt, voice }: Options,
) => {
  const voices = {
    nova: 'nova',
    alloy: 'alloy',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    shimmer: 'shimmer',
  };

  const selectedVoice = voices[voice] || 'alloy';

  const folderPath = path.resolve(__dirname, '../../../generated/audios/');
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  fs.mkdirSync(folderPath, { recursive: true });

  const audio = await openAI.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await audio.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);

  return speechFile;
};
