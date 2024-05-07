import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export const getImageByNameUseCase = async (fileName: string) => {
  const filePath = path.resolve(
    __dirname,
    '../../../generated/images/',
    fileName,
  );

  if (!fs.existsSync(filePath))
    throw new NotFoundException(`File ${fileName} not found`);

  return filePath;
};
