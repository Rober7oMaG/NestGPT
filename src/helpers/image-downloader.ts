import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

export const downloadImageAsPNG = async (
  url: string,
  fullPath: boolean = false,
) => {
  const response = await fetch(url);

  if (!response.ok)
    throw new InternalServerErrorException('Could not download image');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageName = `${new Date().getTime()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());

  // fs.writeFileSync(path.join(folderPath, imageName), buffer);

  const filePath = path.join(folderPath, imageName);

  await sharp(buffer).png().ensureAlpha().toFile(filePath);

  return fullPath ? filePath : imageName;
};

export const downloadBase64ImageAsPNG = async (
  base64Image: string,
  fullPath: boolean = false,
) => {
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageName = `${new Date().getTime()}-64.png`;

  const filePath = path.join(folderPath, imageName);

  await sharp(imageBuffer).png().ensureAlpha().toFile(filePath);

  return fullPath ? filePath : imageName;
};
