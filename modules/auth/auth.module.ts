import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ValidatorModule } from '../../shared/validator/validator.module';
import { MailModule } from '../../shared/providers/mail/mail.module';

@Module({
  imports: [
    PassportModule,
    ValidatorModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'my-server',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
