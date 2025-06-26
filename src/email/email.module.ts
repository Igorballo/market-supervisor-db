import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { SimpleEmailService } from './simple-email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: `"Market Supervisor" <${process.env.SMTP_USERNAME}>`,
      },
    }),
  ],
  providers: [EmailService, SimpleEmailService],
  exports: [EmailService, SimpleEmailService],
})
export class EmailModule {} 