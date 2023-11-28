import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../jwt-auth.guard';

import {
  SignupInput,
  UpdateUserInput,
  AuthenticateInput,
} from '../validators/auth.validator';
import { AuthService } from '../services/auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('signup')
  async signup(@Args('input') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @Mutation('login')
  async login(@Args('input') authenticateInput: AuthenticateInput) {
    return this.authService.login(authenticateInput);
  }

  @Mutation('forgotPassword')
  async forgotPassword(@Args('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Mutation('resetPassword')
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @Mutation('verifyEmail')
  async verifyEmail(@Args('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Mutation('refreshToken')
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('logout')
  async logout(@Context() ctx: any) {
    return this.authService.logout(ctx.req.user);
  }
}
