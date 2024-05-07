import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export const getAudioByIdUseCase = async (fileId: string) => {
  const filePath = path.resolve(
    __dirname,
    '../../../generated/audios/',
    `${fileId}.mp3`,
  );

  if (!fs.existsSync(filePath))
    throw new NotFoundException(`File ${fileId} not found`);

  return filePath;
};
