import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserValidator {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  @MinLength(5)
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class UpdateUserInput {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string;

  @IsEmail()
  @IsOptional()
  @MinLength(5)
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsDateString({ strict: false })
  birthdate?: string;
}

export class UpdateUserValidator {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string;

  @IsEmail()
  @IsOptional()
  @MinLength(5)
  @MaxLength(100)
  email?: string;
}
