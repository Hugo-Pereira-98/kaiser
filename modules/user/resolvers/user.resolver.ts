import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CalculateEnergyExpenditureInput,
  FamilyInput,
  FamilyScheduleInput,
} from '../../../types/graphql';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { UpdateUserInput } from '../validators/user.validator';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('getFamilyMembers')
  @UseGuards(JwtAuthGuard)
  async getFamilyMembers(@Context() ctx: any) {
    return this.userService.getFamilyMembers(ctx.req.user.id);
  }

  @Query('family')
  @UseGuards(JwtAuthGuard)
  async family(@Context() ctx: any) {
    return this.userService.getFamily(ctx.req.user.id);
  }

  @Query('getFamilyMealPlans')
  @UseGuards(JwtAuthGuard)
  async getFamilyMealPlans(@Context() ctx: any) {
    return this.userService.getFamilyMealPlans(ctx.req.user.id);
  }

  @Query('getWeekRange')
  @UseGuards(JwtAuthGuard)
  async getWeekRange(@Context() ctx: any) {
    return this.userService.fetchWeekRange();
  }

  @Query('fetchMealPlanForWeek')
  @UseGuards(JwtAuthGuard)
  async fetchMealPlanForWeek(
    @Args('weekName') weekName: string,
    @Context() ctx: any
  ) {
    return this.userService.fetchMealPlanForWeek(ctx.req.user.id, weekName);
  }

  @Mutation('calculateWeeks')
  @UseGuards(JwtAuthGuard)
  async calculateWeeks() {
    return this.userService.calculateWeeks();
  }

  @Mutation('calculateMealPlan')
  @UseGuards(JwtAuthGuard)
  async calculateMealPlan(@Context() ctx: any) {
    return this.userService.calculateWeeklyMealPlan(ctx.req.user.id);
  }

  @Query('getFamilySchedule')
  @UseGuards(JwtAuthGuard)
  async getFamilySchedule(@Context() ctx: any) {
    return this.userService.getFamilySchedule(ctx.req.user.id);
  }

  @Mutation('createFamilySchedule')
  @UseGuards(JwtAuthGuard)
  async createFamilySchedule(
    @Args('input') familyScheduleInput: FamilyScheduleInput,
    @Context() ctx: any
  ) {
    return this.userService.createFamilySchedule(
      familyScheduleInput,
      ctx.req.user.id
    );
  }

  @Mutation('updateUser')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('input') updateUserInput: UpdateUserInput,
    @Context() ctx: any
  ) {
    return this.userService.updateUser(updateUserInput, ctx.req.user.id);
  }

  @Query('users')
  @UseGuards(JwtAuthGuard)
  async users() {
    return this.userService.getAllUsers();
  }

  @Query('findUser')
  @UseGuards(JwtAuthGuard)
  async findUser(@Args('id') id: number) {
    return this.userService.findUser(id);
  }

  @Query('user')
  @UseGuards(JwtAuthGuard)
  async user(@Context() ctx: any) {
    const uid = ctx.req.user.uid;
    return this.userService.findByUid(uid);
  }

  @Mutation('createNutrientGuidelines')
  async createNutrientGuidelines() {
    return this.userService.createManyNutrientGuidelines();
  }

  @Mutation('createRecipes')
  async createRecipes() {
    return this.userService.createManyRecipes();
  }

  @Mutation('createFamily')
  @UseGuards(JwtAuthGuard)
  async createFamily(@Args('input') input: FamilyInput, @Context() ctx: any) {
    return this.userService.createFamily(input, ctx.req.user.id);
  }

  @Mutation('calculateEnergyExpenditure')
  async calculateEnergyExpenditure(
    @Args('input') input: CalculateEnergyExpenditureInput
  ) {
    const { age, sex, group, height, weight, activityLevel, weeksPregnant } =
      input;
    const totalEnergyExpenditure =
      await this.userService.calculateEnergyExpenditure(
        age,
        sex,
        group,
        height,
        weight,
        activityLevel,
        weeksPregnant
      );
    return { totalEnergyExpenditure };
  }
}
