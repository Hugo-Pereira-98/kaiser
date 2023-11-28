import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { NodeMailerProvider } from '../../../shared/providers/mail/nodemailer.provider';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { parse } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticateInput, SignupInput } from '../validators/auth.validator';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailProvider: NodeMailerProvider,
    private readonly jwtService: JwtService
  ) {}
  async validateUserPassword(email: string, plainPassword: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isPasswordMatching = await bcrypt.compare(
      plainPassword,
      user.password
    );
    if (!isPasswordMatching) return null;

    return user;
  }
  async resetPassword(token: string, newPassword: string) {
    const decodedToken = this.jwtService.verify(token);
    const user = await this.prisma.user.findUnique({
      where: { uid: decodedToken.uid },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { uid: user.uid },
      data: { password: hashedPassword },
    });

    return { message: 'Password has been reset.' };
  }

  async signup(data: SignupInput) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const birthdate = data.birthdate
      ? parse(data.birthdate, 'dd/MM/yyyy', new Date())
      : null;

    if (birthdate && isNaN(birthdate.getTime())) {
      throw new Error('Invalid birthdate format. Expected format: dd/MM/yyyy');
    }

    const user = await this.prisma.user.create({
      data: {
        uid: uuidv4(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashedPassword,
        birthdate,
        gender: data.gender,
      },
    });
    return this.generateTokens(user);
  }

  private async removeExistingRefreshToken(userId: number) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('No user found with this email address.');

    const resetToken = this.jwtService.sign(
      { uid: user.uid },
      { expiresIn: '25m' }
    );

    const resetLink = `http://TBD/reset-password?token=${resetToken}`;

    await this.mailProvider.sendMail({
      to: { email: email, name: 'TBD' },
      subject: 'Password Reset Request',
      text: `Please click on the following link to reset your password: ${resetLink}`,
    });

    return { message: 'Password reset email sent.' };
  }

  async login(data: AuthenticateInput) {
    const user = await this.validateUserPassword(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.removeExistingRefreshToken(user.id);
    return this.generateTokens(user);
  }

  async verifyEmail(token: string) {
    const decodedToken = this.jwtService.verify(token);
    const user = await this.prisma.user.findUnique({
      where: { uid: decodedToken.uid },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.prisma.user.update({
      where: { uid: user.uid },
      data: { emailVerifiedAt: new Date() },
    });

    return { message: 'Email verified.' };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async refreshToken(refreshToken: string) {
    const decodedToken = this.jwtService.decode(refreshToken);

    if (
      !decodedToken ||
      typeof decodedToken !== 'object' ||
      !decodedToken.uid
    ) {
      throw new UnauthorizedException('Invalid token.');
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { refreshToken: refreshToken },
    });

    if (!storedToken) {
      throw new NotFoundException('Token not found.');
    }

    const user = await this.prisma.user.findUnique({
      where: { uid: decodedToken.uid },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const newAccessToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
        uid: user.uid,
        type: 'ACCESS',
      },
      {
        expiresIn: '1d',
      }
    );

    return { user, accessToken: newAccessToken, refreshToken: refreshToken };
  }

  async generateTokens(user: { id: number; email: string; uid: string }) {
    const accessPayload = {
      email: user.email,
      sub: user.id,
      uid: user.uid,
      type: 'ACCESS',
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '1d',
    });

    const existingRefreshToken = await this.prisma.refreshToken.findFirst({
      where: { userId: user.id, expiresDate: { gte: new Date() } },
    });

    let refreshToken;
    if (!existingRefreshToken) {
      const refreshPayload = {
        email: user.email,
        sub: user.id,
        uid: user.uid,
        type: 'REFRESH',
      };

      refreshToken = this.jwtService.sign(refreshPayload, {
        expiresIn: '30d',
      });

      await this.prisma.refreshToken.create({
        data: {
          refreshToken: refreshToken,
          userId: user.id,
          expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    } else {
      refreshToken = existingRefreshToken.refreshToken;
    }

    return { user, token: accessToken, refreshToken };
  }

  async logout(user: any) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });
    return { message: 'Logged out successfully.' };
  }
}
