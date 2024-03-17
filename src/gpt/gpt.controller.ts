import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDTO, ProsConsDiscusserDTO } from './dtos';
import { Response } from 'express';

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
}
