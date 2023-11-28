import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowed = await super.canActivate(context);
    if (!allowed) {
      throw new UnauthorizedException('Invalid token');
    }

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const token = req.headers.authorization?.split(' ')[1];

    const blacklistedToken = await this.prisma.refreshToken.findFirst({
      where: { refreshToken: token },
    });

    if (blacklistedToken?.isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    const user = await this.prisma.user.findUnique({
      where: { uid: req.user.uid },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    req.user = user;
    return true;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
