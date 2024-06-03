import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  checkCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessagesListUseCase,
} from './use-cases';
import { QuestionDTO } from './dto';

@Injectable()
export class AssistantService {
  private openAI = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openAI);
  }

  async userQuestion(questionDTO: QuestionDTO) {
    const { threadId } = questionDTO;

    await createMessageUseCase(this.openAI, questionDTO);
    const { id: runId } = await createRunUseCase(this.openAI, { threadId });
    await checkCompleteStatusUseCase(this.openAI, { threadId, runId });
    const messages = await getMessagesListUseCase(this.openAI, { threadId });

    return messages.reverse();
  }
}
