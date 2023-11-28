
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum UserGender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export enum MealType {
    ASSEMBLE = "ASSEMBLE",
    COOK = "COOK",
    EAT_LEFTOVER = "EAT_LEFTOVER",
    EAT_OUT = "EAT_OUT"
}

export enum ActivityLevel {
    Sedentary = "Sedentary",
    LowActive = "LowActive",
    Active = "Active",
    VeryActive = "VeryActive"
}

export enum WeightGoal {
    Lose = "Lose",
    Maintain = "Maintain",
    Gain = "Gain"
}

export class SignupInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender?: Nullable<UserGender>;
    birthdate?: Nullable<string>;
}

export class AuthenticateInput {
    email: string;
    password: string;
}

export class MealInput {
    type: MealType;
    quantity: number;
}

export class DailyScheduleInput {
    breakfast?: Nullable<MealInput>;
    lunch?: Nullable<MealInput>;
    snack?: Nullable<MealInput>;
    dinner?: Nullable<MealInput>;
}

export class FamilyScheduleInput {
    monday?: Nullable<DailyScheduleInput>;
    tuesday?: Nullable<DailyScheduleInput>;
    wednesday?: Nullable<DailyScheduleInput>;
    thursday?: Nullable<DailyScheduleInput>;
    friday?: Nullable<DailyScheduleInput>;
    saturday?: Nullable<DailyScheduleInput>;
    sunday?: Nullable<DailyScheduleInput>;
}

export class FamilyMemberInput {
    firstName: string;
    dateOfBirth: DateTime;
    gender: UserGender;
    height: number;
    weight: number;
    activityLevel: ActivityLevel;
    weightGoal: WeightGoal;
    isUser?: Nullable<boolean>;
}

export class FamilyInput {
    name: string;
    numberOfMembers: number;
    familyMembers: FamilyMemberInput[];
    sugar?: Nullable<boolean>;
    peanuts?: Nullable<boolean>;
    treeNuts?: Nullable<boolean>;
    lactose?: Nullable<boolean>;
    meat?: Nullable<boolean>;
    spicy?: Nullable<boolean>;
    bland?: Nullable<boolean>;
    flavorful?: Nullable<boolean>;
    chinese?: Nullable<boolean>;
    japanese?: Nullable<boolean>;
    korean?: Nullable<boolean>;
    thai?: Nullable<boolean>;
    vietnamese?: Nullable<boolean>;
    italian?: Nullable<boolean>;
    american?: Nullable<boolean>;
    mexican?: Nullable<boolean>;
    indian?: Nullable<boolean>;
    french?: Nullable<boolean>;
    german?: Nullable<boolean>;
    middleEastern?: Nullable<boolean>;
    breakfastAtHome?: Nullable<boolean>;
}

export class UpdateUserInput {
    id: number;
    uid?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    email?: Nullable<string>;
}

export class CreateNutrientGuidelinesInput {
    groupName: string;
    ageRange: string;
    sex: string;
    vitaminA: string;
    vitaminC: string;
    vitaminE: string;
    vitaminK: string;
    thiamin: string;
    riboflavin: string;
    niacin: string;
    vitaminB6: string;
    folate: string;
    vitaminB12: string;
    totalFiber: string;
    linoleicAcid: string;
    alphaLinolenicAcid: string;
    protein: string;
    calcium: string;
    copper: string;
    iron: string;
    magnesium: string;
    manganese: string;
    phosphorus: string;
    selenium: string;
    zinc: string;
    potassium: string;
}

export class CalculateEnergyExpenditureInput {
    age: number;
    sex: UserGender;
    group: string;
    height: number;
    weight: number;
    activityLevel: string;
    weeksPregnant?: Nullable<number>;
}

export class AuthPayload {
    token: string;
    refreshToken: string;
    user: User;
}

export class RefreshPayload {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export abstract class IMutation {
    abstract signup(input: SignupInput): AuthPayload | Promise<AuthPayload>;

    abstract login(input: AuthenticateInput): AuthPayload | Promise<AuthPayload>;

    abstract forgotPassword(email: string): Response | Promise<Response>;

    abstract resetPassword(token: string, newPassword: string): Response | Promise<Response>;

    abstract verifyEmail(token: string): MessageResponse | Promise<MessageResponse>;

    abstract refreshToken(refreshToken: string): RefreshPayload | Promise<RefreshPayload>;

    abstract logout(): MessageResponse | Promise<MessageResponse>;

    abstract updateUser(input: UpdateUserInput): User | Promise<User>;

    abstract createNutrientGuidelines(): Nullable<NutrientGuidelines>[] | Promise<Nullable<NutrientGuidelines>[]>;

    abstract createRecipes(): string | Promise<string>;

    abstract calculateEnergyExpenditure(input: CalculateEnergyExpenditureInput): EnergyExpenditureResult | Promise<EnergyExpenditureResult>;

    abstract createFamily(input: FamilyInput): Family | Promise<Family>;

    abstract createFamilySchedule(input: FamilyScheduleInput): FamilySchedule | Promise<FamilySchedule>;

    abstract updateFamilySchedule(input: FamilyScheduleInput): FamilySchedule | Promise<FamilySchedule>;

    abstract calculateMealPlan(): string | Promise<string>;

    abstract calculateWeeks(): string | Promise<string>;
}

export class Family {
    id: number;
    name: string;
    numberOfMembers: number;
    totalCaloriesPerDay?: Nullable<number>;
    familyMembers: Nullable<FamilyMember>[];
}

export class FamilyMember {
    id: number;
    firstName: string;
    dateOfBirth: DateTime;
    gender: UserGender;
    height: number;
    weight: number;
    activityLevel: ActivityLevel;
    weightGoal: WeightGoal;
    totalCaloriesPerDay?: Nullable<number>;
    individualNutrientRequirement?: Nullable<IndividualNutrientRequirements>;
}

export class IndividualNutrientRequirements {
    id: number;
    familyMemberId?: Nullable<number>;
    nutrientGuidelineId?: Nullable<number>;
    vitaminA?: Nullable<BigInt>;
    vitaminC?: Nullable<BigInt>;
    vitaminE?: Nullable<BigInt>;
    vitaminK?: Nullable<BigInt>;
    vitaminB1?: Nullable<BigInt>;
    vitaminB2?: Nullable<BigInt>;
    vitaminB3?: Nullable<BigInt>;
    vitaminB6?: Nullable<BigInt>;
    folate?: Nullable<BigInt>;
    vitaminB12?: Nullable<BigInt>;
    totalFiber?: Nullable<BigInt>;
    omega3?: Nullable<BigInt>;
    omega6?: Nullable<BigInt>;
    protein?: Nullable<BigInt>;
    calcium?: Nullable<BigInt>;
    copper?: Nullable<BigInt>;
    iron?: Nullable<BigInt>;
    magnesium?: Nullable<BigInt>;
    manganese?: Nullable<BigInt>;
    phosphorus?: Nullable<BigInt>;
    selenium?: Nullable<BigInt>;
    zinc?: Nullable<BigInt>;
    potassium?: Nullable<BigInt>;
}

export class User {
    id: number;
    uid: string;
    email: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    gender?: Nullable<UserGender>;
    birthdate?: Nullable<DateTime>;
    emailVerifiedAt?: Nullable<DateTime>;
    needUpdatePassword: boolean;
    isActive: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class MessageResponse {
    message: string;
}

export class Response {
    message: string;
}

export class FamilySchedule {
    id: number;
    familyId: number;
    monday?: Nullable<JSON>;
    tuesday?: Nullable<JSON>;
    wednesday?: Nullable<JSON>;
    thursday?: Nullable<JSON>;
    friday?: Nullable<JSON>;
    saturday?: Nullable<JSON>;
    sunday?: Nullable<JSON>;
}

export class NutrientGuidelines {
    id: number;
    groupName: string;
    ageRange: string;
    sex: string;
    vitaminA?: Nullable<string>;
    vitaminC?: Nullable<string>;
    vitaminE?: Nullable<string>;
    vitaminK?: Nullable<string>;
    thiamin?: Nullable<string>;
    riboflavin?: Nullable<string>;
    niacin?: Nullable<string>;
    vitaminB6?: Nullable<string>;
    folate?: Nullable<string>;
    vitaminB12?: Nullable<string>;
    totalFiber?: Nullable<string>;
    linoleicAcid?: Nullable<string>;
    alphaLinolenicAcid?: Nullable<string>;
    protein?: Nullable<string>;
    calcium?: Nullable<string>;
    copper?: Nullable<string>;
    iron?: Nullable<string>;
    magnesium?: Nullable<string>;
    manganese?: Nullable<string>;
    phosphorus?: Nullable<string>;
    selenium?: Nullable<string>;
    zinc?: Nullable<string>;
    potassium?: Nullable<string>;
}

export class EnergyExpenditureResult {
    totalEnergyExpenditure: number;
}

export class Week {
    id?: Nullable<number>;
    name?: Nullable<string>;
    monday?: Nullable<DateTime>;
    tuesday?: Nullable<DateTime>;
    wednesday?: Nullable<DateTime>;
    thursday?: Nullable<DateTime>;
    friday?: Nullable<DateTime>;
    saturday?: Nullable<DateTime>;
    sunday?: Nullable<DateTime>;
}

export class WeekMealPlan {
    week: Week;
    mealPlan?: Nullable<FamilyMealPlan>;
}

export class FamilyMealPlan {
    id?: Nullable<number>;
    familyId?: Nullable<number>;
    weekId?: Nullable<number>;
    monday?: Nullable<JSON>;
    tuesday?: Nullable<JSON>;
    wednesday?: Nullable<JSON>;
    thursday?: Nullable<JSON>;
    friday?: Nullable<JSON>;
    saturday?: Nullable<JSON>;
    sunday?: Nullable<JSON>;
}

export abstract class IQuery {
    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract findUser(id: number): Nullable<User> | Promise<Nullable<User>>;

    abstract user(): User | Promise<User>;

    abstract family(): Nullable<Family> | Promise<Nullable<Family>>;

    abstract getFamilySchedule(): Nullable<FamilySchedule> | Promise<Nullable<FamilySchedule>>;

    abstract getFamilyMealPlans(): Nullable<WeekMealPlan>[] | Promise<Nullable<WeekMealPlan>[]>;

    abstract getFamilyMembers(): Nullable<FamilyMember>[] | Promise<Nullable<FamilyMember>[]>;

    abstract getWeekRange(): Nullable<Week>[] | Promise<Nullable<Week>[]>;

    abstract fetchMealPlanForWeek(weekName: string): WeekMealPlan | Promise<WeekMealPlan>;
}

export type JSON = any;
export type BigInt = any;
export type DateTime = any;
type Nullable<T> = T | null;
