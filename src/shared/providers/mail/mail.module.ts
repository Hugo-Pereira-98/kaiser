import { Module } from '@nestjs/common';
import { NodeMailerProvider } from './nodemailer.provider';

@Module({
  providers: [NodeMailerProvider],
  exports: [NodeMailerProvider],
})
export class MailModule {}
