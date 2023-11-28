import { Module } from '@nestjs/common';
import { ValidatorModule } from '../../shared/validator/validator.module';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../../shared/providers/mail/mail.module';

@Module({
  imports: [ValidatorModule, AuthModule, MailModule],
  providers: [UserResolver, UserService],
  controllers: [],
})
export class UserModule {}
