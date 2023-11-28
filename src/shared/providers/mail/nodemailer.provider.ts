import * as nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import ISendMailDTO from './send-mail.dto';

@Injectable()
export class NodeMailerProvider {
  private ses: aws.SES;
  private transporter: nodemailer.Transporter;

  constructor() {
    this.ses = new aws.SES({
      apiVersion: '2010-12-01',
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.transporter = nodemailer.createTransport({
      SES: { ses: this.ses, aws: aws },
    });
  }

  async sendMail({ to, subject, text }: ISendMailDTO): Promise<void> {
    try {
      await this.transporter.sendMail({
        to: to.email,
        from: 'Limo <hugo@limo.tech>',
        subject: subject,
        text: text,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email.');
    }
  }
}
