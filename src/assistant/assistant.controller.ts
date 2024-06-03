import { Body, Controller, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { QuestionDTO } from './dto/user-question.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('create-thread')
  async createThread() {
    return this.assistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(@Body() questionDTO: QuestionDTO) {
    return this.assistantService.userQuestion(questionDTO);
  }
}
