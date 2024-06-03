import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import {
  AudioToTextDTO,
  ImageGenerationDTO,
  ImageVariationDTO,
  OrthographyDTO,
  ProsConsDiscusserDTO,
  TextToAudioDTO,
  TranslateDTO,
} from './dtos';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDTO: OrthographyDTO) {
    return this.gptService.orthographyCheck(orthographyDTO);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() prosConsDiscusserDTO: ProsConsDiscusserDTO) {
    return this.gptService.prosConsDiscusser(prosConsDiscusserDTO);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDiscusserDTO: ProsConsDiscusserDTO,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDiscusserStream(prosConsDiscusserDTO);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translate(@Body() translateDTO: TranslateDTO) {
    return this.gptService.translate(translateDTO);
  }

  @Get('text-to-audio/:fileId')
  async getAudioById(@Param('fileId') fileId: string, @Res() res: Response) {
    const filePath = await this.gptService.getAudioById(fileId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDTO: TextToAudioDTO,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDTO);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5 MB',
          }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToToTextDTO: AudioToTextDTO,
  ) {
    return this.gptService.audioToText(file, audioToToTextDTO);
  }

  @Get('image-generation/:fileName')
  async getImageByName(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.getImageByName(fileName);

    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDTO: ImageGenerationDTO) {
    return await this.gptService.imageGeneration(imageGenerationDTO);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDTO: ImageVariationDTO) {
    return await this.gptService.imageVariation(imageVariationDTO);
  }

  @Post('image-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async textToImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5 MB',
          }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('prompt') prompt: string,
  ) {
    return this.gptService.imageToText(file, prompt);
  }
}
