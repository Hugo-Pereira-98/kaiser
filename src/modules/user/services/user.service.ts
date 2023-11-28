import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { nutrientRequirements } from '../utils/data';
import { UpdateUserInput } from '../validators/user.validator';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { Family } from '@prisma/client';

type RecipeCSVRow = string[];

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getFamilyMembers(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    console.log('user', user);

    if (!user) {
      throw new Error('User not found');
    }

    const familyMember = await this.prisma.familyMember.findUnique({
      where: { id: user.familyMemberId },
    });

    if (!familyMember) {
      throw new Error('Family member not found');
    }

    const familyMembers = await this.prisma.familyMember.findMany({
      where: { familyId: familyMember.familyId },
      include: { individualNutrientRequirement: true },
    });
    return familyMembers;
  }

  private async calculateTotalFamilyNutrientRequirements(familyId: number) {
    const familyMembers = await this.prisma.familyMember.findMany({
      where: { familyId },
      include: { individualNutrientRequirement: true },
    });

    let totalNutrientRequirements = {
      totalCaloriesPerDay: 0,
      vitaminA: 0.0,
      vitaminC: 0.0,
      vitaminE: 0.0,
      vitaminK: 0.0,
      vitaminB1: 0.0,
      vitaminB2: 0.0,
      vitaminB3: 0.0,
      vitaminB6: 0.0,
      folate: 0.0,
      vitaminB12: 0.0,
      totalFiber: 0.0,
      omega3: 0.0,
      omega6: 0.0,
      protein: 0.0,
      calcium: 0.0,
      copper: 0.0,
      iron: 0.0,
      magnesium: 0.0,
      manganese: 0.0,
      phosphorus: 0.0,
      selenium: 0.0,
      zinc: 0.0,
      potassium: 0.0,
    };

    for (const member of familyMembers) {
      if (member.individualNutrientRequirement) {
        totalNutrientRequirements.vitaminA +=
          member.individualNutrientRequirement.vitaminA;
        totalNutrientRequirements.vitaminC +=
          member.individualNutrientRequirement.vitaminC;
        totalNutrientRequirements.vitaminE +=
          member.individualNutrientRequirement.vitaminE;
        totalNutrientRequirements.vitaminK +=
          member.individualNutrientRequirement.vitaminK;
        totalNutrientRequirements.vitaminB1 +=
          member.individualNutrientRequirement.vitaminB1;
        totalNutrientRequirements.vitaminB2 +=
          member.individualNutrientRequirement.vitaminB2;
        totalNutrientRequirements.vitaminB3 +=
          member.individualNutrientRequirement.vitaminB3;
        totalNutrientRequirements.vitaminB6 +=
          member.individualNutrientRequirement.vitaminB6;
        totalNutrientRequirements.folate +=
          member.individualNutrientRequirement.folate;
        totalNutrientRequirements.vitaminB12 +=
          member.individualNutrientRequirement.vitaminB12;
        totalNutrientRequirements.totalFiber +=
          member.individualNutrientRequirement.totalFiber;
        totalNutrientRequirements.omega3 +=
          member.individualNutrientRequirement.omega3;
        totalNutrientRequirements.omega6 +=
          member.individualNutrientRequirement.omega6;
        totalNutrientRequirements.protein +=
          member.individualNutrientRequirement.protein;
        totalNutrientRequirements.calcium +=
          member.individualNutrientRequirement.calcium;
        totalNutrientRequirements.copper +=
          member.individualNutrientRequirement.copper;
        totalNutrientRequirements.iron +=
          member.individualNutrientRequirement.iron;
        totalNutrientRequirements.magnesium +=
          member.individualNutrientRequirement.magnesium;
        totalNutrientRequirements.manganese +=
          member.individualNutrientRequirement.manganese;
        totalNutrientRequirements.phosphorus +=
          member.individualNutrientRequirement.phosphorus;
        totalNutrientRequirements.selenium +=
          member.individualNutrientRequirement.selenium;
        totalNutrientRequirements.zinc +=
          member.individualNutrientRequirement.zinc;
        totalNutrientRequirements.potassium +=
          member.individualNutrientRequirement.potassium;
      }
    }

    // Fetch total daily calories for the  family
    const family = await this.prisma.family.findUnique({
      where: { id: familyId },
    });

    if (family && family.totalCaloriesPerDay) {
      totalNutrientRequirements.totalCaloriesPerDay =
        family.totalCaloriesPerDay;
    } else {
      throw new Error('Total calories per day for the family is not defined.');
    }

    return totalNutrientRequirements;
  }

  async calculateWeeklyMealPlan(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { familyMember: true },
    });

    if (!user.familyMember) {
      throw new Error('User is not linked to any family.');
    }

    const family = await this.prisma.family.findUnique({
      where: { id: user.familyMember.familyId },
    });

    if (!family) {
      throw new Error('Family not found.');
    }

    const totalNutrientRequirements =
      await this.calculateTotalFamilyNutrientRequirements(
        user.familyMember.familyId
      );

    let nextMonday = new Date();
    nextMonday.setDate(
      nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7)
    );

    for (let week = 0; week < 5; week++) {
      const weekName = `Week of ${nextMonday.getDate()}/${
        nextMonday.getMonth() + 1
      }/${nextMonday.getFullYear()}`;

      let existingWeek = await this.prisma.week.findFirst({
        where: { name: weekName },
      });

      if (!existingWeek) {
        const dates = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(nextMonday);
          date.setDate(nextMonday.getDate() + i);
          dates.push(date);
        }

        existingWeek = await this.prisma.week.create({
          data: {
            name: weekName,
            monday: dates[0],
            tuesday: dates[1],
            wednesday: dates[2],
            thursday: dates[3],
            friday: dates[4],
            saturday: dates[5],
            sunday: dates[6],
          },
        });
      }

      const existingMealPlan = await this.prisma.familyMealPlan.findFirst({
        where: {
          familyId: family.id,
          weekId: existingWeek.id,
        },
      });

      if (!existingMealPlan) {
        const weeklyMealPlan = {} as any;

        for (const day of [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ]) {
          const recipeOptions = await this.getRecipeOptions(family);
          const adjustedRecipeOptions = await this.adjustRecipeQuantities(
            recipeOptions,
            family,
            totalNutrientRequirements
          );
          console.log('adjustedRecipeOptions', adjustedRecipeOptions);

          weeklyMealPlan[day.toLowerCase()] = JSON.stringify(
            adjustedRecipeOptions
          );
        }
        console.log('totalNutrientRequirements', totalNutrientRequirements);

        await this.prisma.familyMealPlan.create({
          data: {
            familyId: family.id,
            weekId: existingWeek.id,
            monday: weeklyMealPlan.monday,
            tuesday: weeklyMealPlan.tuesday,
            wednesday: weeklyMealPlan.wednesday,
            thursday: weeklyMealPlan.thursday,
            friday: weeklyMealPlan.friday,
            saturday: weeklyMealPlan.saturday,
            sunday: weeklyMealPlan.sunday,
          },
        });
      }

      nextMonday.setDate(nextMonday.getDate() + 7);
    }

    return 'Meal plans calculated and stored for the next 5 weeks.';
  }

  async fetchWeekRange() {
    const today = new Date();
    let currentMonday = new Date();
    currentMonday.setDate(today.getDate() - (today.getDay() - 1));

    const startDate = new Date(currentMonday);
    startDate.setDate(currentMonday.getDate() - 35);
    const endDate = new Date(currentMonday);
    endDate.setDate(currentMonday.getDate() + 35);

    const weeks = await this.prisma.week.findMany({
      where: {
        monday: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { monday: 'asc' },
    });

    return weeks;
  }

  async fetchMealPlanForWeek(userId: number, weekName: string) {
    // Find the user and associated family
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { familyMember: true },
    });

    if (!user.familyMember) {
      throw new Error('User is not linked to any family.');
    }
    const familyId = user.familyMember.familyId;

    // Find the week based on the week name
    const week = await this.prisma.week.findFirst({
      where: { name: weekName },
    });

    if (!week) {
      throw new Error('Week not found.');
    }

    // Retrieve the meal plan for the specified week and family
    const mealPlan = await this.prisma.familyMealPlan.findFirst({
      where: {
        familyId,
        weekId: week.id, // Use the retrieved week ID here
      },
    });

    // Construct the return object
    return {
      week: {
        id: week.id,
        name: week.name,
        monday: week.monday,
        tuesday: week.tuesday,
        wednesday: week.wednesday,
        thursday: week.thursday,
        friday: week.friday,
        saturday: week.saturday,
      },
      mealPlan: mealPlan
        ? {
            id: mealPlan.id,
            familyId: mealPlan.familyId,
            weekId: mealPlan.weekId,
            monday: mealPlan.monday
              ? JSON.parse(mealPlan.monday.toString())
              : null,
            tuesday: mealPlan.tuesday
              ? JSON.parse(mealPlan.tuesday.toString())
              : null,
            wednesday: mealPlan.wednesday
              ? JSON.parse(mealPlan.wednesday.toString())
              : null,
            thursday: mealPlan.thursday
              ? JSON.parse(mealPlan.thursday.toString())
              : null,
            friday: mealPlan.friday
              ? JSON.parse(mealPlan.friday.toString())
              : null,
            saturday: mealPlan.saturday
              ? JSON.parse(mealPlan.saturday.toString())
              : null,
            sunday: mealPlan.sunday
              ? JSON.parse(mealPlan.sunday.toString())
              : null,
          }
        : null,
    };
  }

  async getFamilyMealPlans(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { familyMember: true },
    });
    if (!user.familyMember) {
      throw new Error('User is not linked to any family.');
    }
    const familyId = user.familyMember.familyId;
    const today = new Date();
    let currentMonday = new Date();
    currentMonday.setDate(today.getDate() - (today.getDay() - 1));

    // Calculate the starting date of the last five weeks and the next five weeks
    const startDate = new Date(currentMonday);
    startDate.setDate(currentMonday.getDate() - 35); // Start from five weeks ago
    const endDate = new Date(currentMonday);
    endDate.setDate(currentMonday.getDate() + 35); // End at five weeks from now

    // Retrieve weeks within this date range
    const weeks = await this.prisma.week.findMany({
      where: {
        monday: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { monday: 'asc' },
    });

    // Retrieve meal plans for these weeks for the given family
    const familyMealPlans = await Promise.all(
      weeks.map(async (week) => {
        const mealPlan = await this.prisma.familyMealPlan.findFirst({
          where: {
            familyId,
            weekId: week.id,
          },
        });

        return {
          week: {
            id: week.id,
            name: week.name,
          },
          mealPlan: mealPlan
            ? {
                id: mealPlan.id,
                familyId: mealPlan.familyId,
                weekId: mealPlan.weekId,
                monday: mealPlan.monday
                  ? JSON.parse(mealPlan.monday.toString())
                  : null,
                tuesday: mealPlan.tuesday
                  ? JSON.parse(mealPlan.tuesday.toString())
                  : null,
                wednesday: mealPlan.wednesday
                  ? JSON.parse(mealPlan.wednesday.toString())
                  : null,
                thursday: mealPlan.thursday
                  ? JSON.parse(mealPlan.thursday.toString())
                  : null,
                friday: mealPlan.friday
                  ? JSON.parse(mealPlan.friday.toString())
                  : null,
                saturday: mealPlan.saturday
                  ? JSON.parse(mealPlan.saturday.toString())
                  : null,
                sunday: mealPlan.sunday
                  ? JSON.parse(mealPlan.sunday.toString())
                  : null,
              }
            : null,
        };
      })
    );

    console.log('familyMealPlans', familyMealPlans);

    return familyMealPlans;
  }

  private async adjustRecipeQuantities(
    recipeOptions: any,
    family: Family,
    totalNutrientRequirements: any
  ) {
    const mealCalorieRanges = {
      breakfast: { min: 15, max: 25 },
      lunch: { min: 30, max: 40 },
      snack: { min: 10, max: 15 },
      dinner: { min: 30, max: 40 },
    };

    let adjustedRecipeOptions = {};
    const familyDailyCalories = totalNutrientRequirements.totalCaloriesPerDay;
    const minAllowedCalories = familyDailyCalories * 0.9; // 90% of total calories
    const maxAllowedCalories = familyDailyCalories * 1.1; // 110% of total calories

    const nutrientFields = [
      'proteinG',
      'carbohydrateAvailableG',
      'carbohydratesG',
      'totalDietaryFiberG',
      'dietaryFiber2016G',
      'fatG',
      'saturatedFatG',
      'transFattyAcidG',
      'cholesterolMg',
      'sodiumMg',
      'calciumMg',
      'copperMg',
      'folateMcg',
      'folateDfeMcgDfe',
      'folateFoodMcg',
      'ironMg',
      'magnesiumMg',
      'manganeseMg',
      'omega3',
      'omega6',
      'phosphorusMg',
      'potassiumMg',
      'seleniumMcg',
      'vitaminA',
      'vitaminC',
      'vitaminE',
      'vitaminK',
      'vitaminB1',
      'vitaminB2',
      'vitaminB3',
      'vitaminB6',
      'vitaminB12',
      'zincMg',
    ];

    let totalDailyAdjustedCalories = 0;

    ['breakfast', 'lunch', 'snack', 'dinner'].forEach((meal) => {
      let mealMinCalories =
        familyDailyCalories * (mealCalorieRanges[meal].min / 100);
      let mealMaxCalories =
        familyDailyCalories * (mealCalorieRanges[meal].max / 100);

      adjustedRecipeOptions[`${meal}Recipes`] = recipeOptions[
        `${meal}Recipes`
      ].map((recipe) => {
        let scaleFactor = 1;
        let adjustedCalories = recipe.caloriesKcal;

        // Adjust by integer increments
        while (
          totalDailyAdjustedCalories + adjustedCalories <= maxAllowedCalories &&
          adjustedCalories < mealMaxCalories
        ) {
          scaleFactor++;
          adjustedCalories = recipe.caloriesKcal * scaleFactor;
        }

        // Rollback to the last valid scaleFactor if exceeded
        if (
          totalDailyAdjustedCalories + adjustedCalories > maxAllowedCalories ||
          adjustedCalories > mealMaxCalories
        ) {
          scaleFactor--;
          adjustedCalories = recipe.caloriesKcal * scaleFactor;
        }

        // Scale nutrient values
        nutrientFields.forEach((field) => {
          recipe[field] = recipe[field] * scaleFactor;
        });

        // Ensure servingSizeQuantity remains an integer
        const adjustedServingSize = Math.round(
          recipe.servingSizeQuantity * scaleFactor
        );

        totalDailyAdjustedCalories += adjustedCalories;

        return {
          ...recipe,
          servingSizeQuantity: adjustedServingSize,
          caloriesKcal: adjustedCalories,
        };
      });
    });

    // Ensure the total daily calories do not exceed the family's requirements
    if (
      totalDailyAdjustedCalories > maxAllowedCalories ||
      totalDailyAdjustedCalories < minAllowedCalories
    ) {
      console.error(
        'Error: Total daily calories are outside the acceptable range.'
      );
      // Adjust the meals to bring the total within the range
      // This could involve scaling up or down certain meals
      // Implement logic here as needed
    }

    return adjustedRecipeOptions;
  }

  private async getRecipeOptions(family: Family) {
    const allRecipes = await this.prisma.recipe.findMany();

    const sumNutrientsForRecipe = (recipeName: string, recipes: any[]) => {
      const nutrientFields = [
        'proteinG',
        'carbohydrateAvailableG',
        'carbohydratesG',
        'totalDietaryFiberG',
        'dietaryFiber2016G',
        'fatG',
        'saturatedFatG',
        'transFattyAcidG',
        'cholesterolMg',
        'sodiumMg',
        'calciumMg',
        'copperMg',
        'folateMcg',
        'folateDfeMcgDfe',
        'folateFoodMcg',
        'ironMg',
        'magnesiumMg',
        'manganeseMg',
        'omega3',
        'omega6',
        'phosphorusMg',
        'potassiumMg',
        'seleniumMcg',
        'vitaminA',
        'vitaminC',
        'vitaminE',
        'vitaminK',
        'vitaminB1',
        'vitaminB2',
        'vitaminB3',
        'vitaminB6',
        'vitaminB12',
        'zincMg',
      ];

      let servingSizeQuantity = 0;

      const summedRecipe = recipes
        .filter((recipe) => recipe.name === recipeName)
        .reduce((acc, recipe, index) => {
          if (index === 0) {
            servingSizeQuantity = recipe.servingSizeQuantity;
          }

          nutrientFields.forEach((field) => {
            acc[field] = (acc[field] || 0) + recipe[field];
          });
          acc['caloriesKcal'] =
            (acc['caloriesKcal'] || 0) + recipe['caloriesKcal'];

          return acc;
        }, {});

      summedRecipe['name'] = recipeName;
      summedRecipe['servingSizeQuantity'] = servingSizeQuantity;

      return summedRecipe;
    };

    const getRandomSummedRecipes = (
      recipes: any[],
      mealType: string,
      count: number
    ) => {
      const filteredRecipes = recipes.filter(
        (recipe) => recipe.type === mealType
      );
      const uniqueRecipeNames = [
        ...new Set(filteredRecipes.map((recipe) => recipe.name)),
      ];

      const randomRecipeNames = uniqueRecipeNames
        .sort(() => 0.5 - Math.random())
        .slice(0, count);

      return randomRecipeNames.map((recipeName) =>
        sumNutrientsForRecipe(recipeName, filteredRecipes)
      );
    };

    // Get random recipes for each meal type and sum their nutrients
    const breakfastRecipes = getRandomSummedRecipes(allRecipes, 'breakfast', 1);
    const lunchRecipes = getRandomSummedRecipes(allRecipes, 'lunch', 1);
    const snackRecipes = getRandomSummedRecipes(allRecipes, 'snack', 1);
    const dinnerRecipes = getRandomSummedRecipes(allRecipes, 'dinner', 1);

    return {
      breakfastRecipes,
      lunchRecipes,
      snackRecipes,
      dinnerRecipes,
    };
  }

  async getFamilySchedule(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { familyMember: true },
    });
    if (!user.familyMember) {
      throw new Error('User is not linked to any family.');
    }

    const familySchedule = await this.prisma.familySchedule.findUnique({
      where: { familyId: user.familyMember.familyId },
    });
    if (!familySchedule) {
      throw new Error('Family schedule not found.');
    }

    return familySchedule;
  }

  async createFamilySchedule(data: any, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { familyMember: true },
    });

    if (!user || !user.familyMember) {
      throw new Error('User or Family Member not found.');
    }

    const familyHasSchedule = await this.prisma.familySchedule.findUnique({
      where: { familyId: user.familyMember.familyId },
    });

    if (familyHasSchedule) {
      throw new Error('Family already has a schedule.');
    }

    const familyId = user.familyMember.familyId;

    // Serialize each day's data
    const serializedData = {
      monday: JSON.stringify(data.monday),
      tuesday: JSON.stringify(data.tuesday),
      wednesday: JSON.stringify(data.wednesday),
      thursday: JSON.stringify(data.thursday),
      friday: JSON.stringify(data.friday),
      saturday: JSON.stringify(data.saturday),
      sunday: JSON.stringify(data.sunday),
    };

    return this.prisma.familySchedule.create({
      data: {
        ...serializedData,
        familyId,
      },
    });
  }

  async findByUid(uid: string) {
    return this.prisma.user.findUnique({ where: { uid } });
  }

  async updateUser(data: UpdateUserInput, userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async findUser(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createManyRecipes() {
    try {
      const recipes: RecipeCSVRow[] = await this.parseCSV(
        'src/modules/user/utils/oldRecipes.csv'
      );

      const formattedRecipes = recipes
        .map((recipe) => this.formatRecipeCsv(recipe))
        .filter((recipe) => recipe !== null);

      const creationResult = await this.prisma.recipe.createMany({
        data: formattedRecipes,
      });

      return 'ok';
    } catch (error) {
      console.error('Error creating recipes: ', error);
      throw error;
    }
  }

  private formatRecipeCsv(recipe: RecipeCSVRow) {
    const formatFloat = (value) => {
      if (!value) {
        return 0.0;
      }
      let formattedValue = value.replace(',', '.').replace(/,/g, '');
      if (!isNaN(Number(formattedValue))) {
        return parseFloat(parseFloat(formattedValue).toFixed(6));
      }
      return 0.0;
    };

    return {
      name: recipe[0],
      type: recipe[1],
      ingredient: recipe[2],
      itemQuantity: parseInt(recipe[3]) || 0,
      itemName: recipe[4],
      servingSizeQuantity: parseInt(recipe[5]) || 0,
      servingSizeMeasure: recipe[6],
      unitMeasure: recipe[7],
      unitQuantity: parseInt(recipe[8]) || 0,
      volumeMeasure: recipe[9],
      volumeQuantity: parseInt(recipe[10]) || 0,
      caloriesKcal: formatFloat(recipe[11]),
      proteinG: formatFloat(recipe[12]),
      carbohydrateAvailableG: formatFloat(recipe[13]),
      carbohydratesG: formatFloat(recipe[14]),
      totalDietaryFiberG: formatFloat(recipe[15]),
      dietaryFiber2016G: formatFloat(recipe[16]),
      fatG: formatFloat(recipe[17]),
      saturatedFatG: formatFloat(recipe[18]),
      transFattyAcidG: formatFloat(recipe[19]),
      cholesterolMg: formatFloat(recipe[20]),
      sodiumMg: formatFloat(recipe[21]),
      calciumMg: formatFloat(recipe[22]),
      copperMg: formatFloat(recipe[23]),
      folateMcg: formatFloat(recipe[24]),
      folateDfeMcgDfe: formatFloat(recipe[25]),
      folateFoodMcg: formatFloat(recipe[26]),
      ironMg: formatFloat(recipe[27]),
      magnesiumMg: formatFloat(recipe[28]),
      manganeseMg: formatFloat(recipe[29]),
      omega3: formatFloat(recipe[30]),
      omega6: formatFloat(recipe[31]),
      phosphorusMg: formatFloat(recipe[32]),
      potassiumMg: formatFloat(recipe[33]),
      seleniumMcg: formatFloat(recipe[34]),
      vitaminA: formatFloat(recipe[35]),
      vitaminC: formatFloat(recipe[36]),
      vitaminE: formatFloat(recipe[37]),
      vitaminK: formatFloat(recipe[38]),
      vitaminB1: formatFloat(recipe[39]),
      vitaminB2: formatFloat(recipe[40]),
      vitaminB3: formatFloat(recipe[41]),
      vitaminB6: formatFloat(recipe[42]),
      vitaminB12: formatFloat(recipe[43]),
      zincMg: formatFloat(recipe[44]),
    };
  }

  private async parseCSV(filePath: string): Promise<RecipeCSVRow[]> {
    return new Promise((resolve, reject) => {
      const results: RecipeCSVRow[] = [];
      let isFirstRow = true;

      fs.createReadStream(path.resolve(filePath))
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', (data) => {
          if (isFirstRow) {
            isFirstRow = false;
          } else {
            results.push(data);
          }
        })
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  private formatRecipeData(recipe: RecipeCSVRow) {
    return {
      name: recipe[0],
      type: recipe[1],
      ingredient: recipe[2],
      itemQuantity: parseInt(recipe[3]) || 0,
      itemName: recipe[4],
      servingSizeQuantity: parseInt(recipe[5]) || 0,
      servingSizeMeasure: recipe[6],
      unitMeasure: recipe[7],
      unitQuantity: parseInt(recipe[8]) || 0,
      volumeMeasure: recipe[9],
      volumeQuantity: parseInt(recipe[10]) || 0,
      caloriesKcal: parseFloat(recipe[11]) || 0.0,
      proteinG: parseFloat(recipe[12]) || 0.0,
      carbohydrateAvailableG: parseFloat(recipe[13]) || 0.0,
      carbohydratesG: parseFloat(recipe[14]) || 0.0,
      totalDietaryFiberG: parseFloat(recipe[15]) || 0.0,
      dietaryFiber2016G: parseFloat(recipe[16]) || 0.0,
      fatG: parseFloat(recipe[17]) || 0.0,
      saturatedFatG: parseFloat(recipe[18]) || 0.0,
      transFattyAcidG: parseFloat(recipe[19]) || 0.0,
      cholesterolMg: parseFloat(recipe[20]) || 0.0,
      sodiumMg: parseFloat(recipe[21]) || 0.0,
      calciumMg: parseFloat(recipe[22]) || 0.0,
      copperMg: parseFloat(recipe[23]) || 0.0,
      folateMcg: parseFloat(recipe[24]) || 0.0,
      folateDfeMcgDfe: parseFloat(recipe[25]) || 0.0,
      folateFoodMcg: parseFloat(recipe[26]) || 0.0,
      ironMg: parseFloat(recipe[27]) || 0.0,
      magnesiumMg: parseFloat(recipe[28]) || 0.0,
      manganeseMg: parseFloat(recipe[29]) || 0.0,
      omega3: parseFloat(recipe[30]) || 0.0,
      omega6: parseFloat(recipe[31]) || 0.0,
      phosphorusMg: parseFloat(recipe[32]) || 0.0,
      potassiumMg: parseFloat(recipe[33]) || 0.0,
      seleniumMcg: parseFloat(recipe[34]) || 0.0,
      vitaminA: parseFloat(recipe[35]) || 0.0,
      vitaminC: parseFloat(recipe[36]) || 0.0,
      vitaminE: parseFloat(recipe[37]) || 0.0,
      vitaminK: parseFloat(recipe[38]) || 0.0,
      vitaminB1: parseFloat(recipe[39]) || 0.0,
      vitaminB2: parseFloat(recipe[40]) || 0.0,
      vitaminB3: parseFloat(recipe[41]) || 0.0,
      vitaminB6: parseFloat(recipe[42]) || 0.0,
      vitaminB12: parseFloat(recipe[43]) || 0.0,
      zincMg: parseFloat(recipe[44]) || 0.0,
    };
  }

  async createFamily(input, userId) {
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { familyMember: true },
      });

      if (user.familyMember) {
        console.log('family member', user.familyMember);
        throw new Error('User already has a family member');
      }
    }

    const { name, numberOfMembers, familyMembers, ...restrictions } = input;

    console.log('familyMembers', familyMembers);
    let totalCaloriesForFamily = 0;

    const createdFamily = await this.prisma.family.create({
      data: {
        name,
        numberOfMembers,
        ...restrictions,
      },
    });

    for (const member of familyMembers) {
      try {
        const age = this.calculateAge(member.dateOfBirth);
        const group = age >= 18 ? 'adult' : 'child';

        const totalEnergyExpenditure = await this.calculateEnergyExpenditure(
          age,
          member.gender,
          group,
          member.height,
          member.weight,
          member.activityLevel
        );

        totalCaloriesForFamily += totalEnergyExpenditure;

        const createdFamilyMember = await this.prisma.familyMember.create({
          data: {
            firstName: member.firstName,
            dateOfBirth: member.dateOfBirth,
            gender: member.gender,
            height: member.height,
            weight: member.weight,
            activityLevel: member.activityLevel,
            weightGoal: member.weightGoal,
            totalCaloriesPerDay: totalEnergyExpenditure,
            familyId: createdFamily.id,
          },
        });

        if (member.isUser) {
          await this.prisma.user.update({
            where: { id: userId },
            data: { familyMemberId: createdFamilyMember.id },
          });
        }

        try {
          await this.createIndividualNutrientRequirements(
            createdFamilyMember.id,
            age,
            member.gender
          );
        } catch (err) {
          console.error(
            'Failed to create individual nutrient requirements for family member ID:',
            createdFamilyMember.id,
            err
          );
        }
      } catch (err) {
        console.error(
          'Failed to process family member:',
          member.firstName,
          err
        );
      }
    }

    await this.prisma.family.update({
      where: { id: createdFamily.id },
      data: { totalCaloriesPerDay: totalCaloriesForFamily },
    });

    return this.prisma.family.findUnique({
      where: { id: createdFamily.id },
      include: { familyMembers: true },
    });
  }

  async calculateIndividualNutrientRequirements(age: number, sex: string) {
    const ageRange = this.convertAgeToRangeString(age);

    const nutrientGuidelines = await this.prisma.nutrientGuidelines.findFirst({
      where: {
        ageRange,
        groupName: age >= 18 ? 'adult' : 'child',
        sex: age >= 18 ? sex : undefined,
      },
    });

    return nutrientGuidelines;
  }

  async createIndividualNutrientRequirements(familyMemberId, age, sex) {
    const ageRange = this.convertAgeToRangeString(age);

    let groupName = '';
    if (age < 1) {
      groupName = 'Infants';
    } else if (age <= 8) {
      groupName = 'Children';
    } else if (age <= 13) {
      groupName = sex === 'MALE' ? 'Males' : 'Females';
    } else {
      groupName = sex === 'MALE' ? 'Males' : 'Females';
    }

    let querySex = groupName === 'Children' ? undefined : sex.toLowerCase();

    const nutrientGuidelines = await this.prisma.nutrientGuidelines.findFirst({
      where: { ageRange, groupName, sex: querySex },
    });

    if (nutrientGuidelines) {
      const createdNutrientRequirements =
        await this.prisma.individualNutrientRequirements.create({
          data: {
            familyMemberId,
            nutrientGuidelineId: nutrientGuidelines.id,

            vitaminA: nutrientGuidelines.vitaminA,
            vitaminC: nutrientGuidelines.vitaminC,
            vitaminE: nutrientGuidelines.vitaminE,
            vitaminK: nutrientGuidelines.vitaminK,
            vitaminB1: nutrientGuidelines.vitaminB1,
            vitaminB2: nutrientGuidelines.vitaminB2,
            vitaminB3: nutrientGuidelines.vitaminB3,
            vitaminB6: nutrientGuidelines.vitaminB6,
            folate: nutrientGuidelines.folate,
            vitaminB12: nutrientGuidelines.vitaminB12,
            totalFiber: nutrientGuidelines.totalFiber,
            omega3: nutrientGuidelines.omega3,
            omega6: nutrientGuidelines.omega6,
            protein: nutrientGuidelines.protein,
            calcium: nutrientGuidelines.calcium,
            copper: nutrientGuidelines.copper,
            iron: nutrientGuidelines.iron,
            magnesium: nutrientGuidelines.magnesium,
            manganese: nutrientGuidelines.manganese,
            phosphorus: nutrientGuidelines.phosphorus,
            selenium: nutrientGuidelines.selenium,
            zinc: nutrientGuidelines.zinc,
            potassium: nutrientGuidelines.potassium,
          },
        });

      return createdNutrientRequirements;
    } else {
      console.log('No nutrient guidelines found for the given age and sex.');
      return null;
    }
  }

  convertAgeToRangeString(age: number): string {
    if (age < 1) return '0–6 mo';
    if (age < 2) return '7–12 mo';
    if (age <= 3) return '1–3 y';
    if (age <= 8) return '4–8 y';
    if (age <= 13) return '9–13 y';
    if (age <= 18) return '14–18 y';
    if (age <= 30) return '19–30 y';
    if (age <= 50) return '31–50 y';
    if (age <= 70) return '51–70 y';
    return '> 70 y';
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  async calculateEnergyExpenditure(
    age,
    sex,
    group,
    height,
    weight,
    activityLevel,
    weeksPregnant = 0
  ) {
    let tee;

    const calculateTEE = (equations) => {
      switch (activityLevel) {
        case 'Sedentary':
          return equations[0];
        case 'LowActive':
          return equations[1];
        case 'Active':
          return equations[2];
        case 'VeryActive':
          return equations[3];
        default:
          throw new Error('Invalid activity level');
      }
    };

    if (sex === 'FEMALE' && group === 'adult') {
      const equations = [
        584.9 - 7.01 * age + 5.72 * height + 11.71 * weight,
        575.77 - 7.01 * age + 6.6 * height + 12.14 * weight,
        710.25 - 7.01 * age + 6.54 * height + 12.34 * weight,
        511.83 - 7.01 * age + 9.07 * height + 12.56 * weight,
      ];
      tee = calculateTEE(equations);
    } else if (sex === 'MALE' && group === 'adult') {
      const equations = [
        753.07 - 10.83 * age + 6.5 * height + 14.1 * weight,
        581.47 - 10.83 * age + 8.3 * height + 14.94 * weight,
        1004.82 - 10.83 * age + 6.52 * height + 15.91 * weight,
        -517.88 - 10.83 * age + 15.61 * height + 19.11 * weight,
      ];
      tee = calculateTEE(equations);
    } else if (sex === 'FEMALE' && group === 'child') {
      const equations = [
        55.59 - 22.25 * age + 8.43 * height + 17.07 * weight,
        -297.54 - 22.25 * age + 12.77 * height + 14.73 * weight,
        -189.55 - 22.25 * age + 11.74 * height + 18.34 * weight,
        -709.59 - 22.25 * age + 18.22 * height + 14.25 * weight,
      ];
      tee = calculateTEE(equations);
    } else if (sex === 'MALE' && group === 'child') {
      const equations = [
        -447.51 + 3.68 * age + 13.01 * height + 13.15 * weight,
        19.12 + 3.68 * age + 8.62 * height + 20.28 * weight,
        -388.19 + 3.68 * age + 12.66 * height + 20.46 * weight,
        -671.75 + 3.68 * age + 15.38 * height + 23.25 * weight,
      ];
      tee = calculateTEE(equations);
    } else if (sex === 'FEMALE' && group === 'pregnant') {
      const equations = [
        1131.2 -
          2.04 * age +
          0.34 * height +
          12.15 * weight +
          9.16 * weeksPregnant,
        693.35 -
          2.04 * age +
          5.73 * height +
          10.2 * weight +
          9.16 * weeksPregnant,
        -223.84 -
          2.04 * age +
          13.23 * height +
          8.15 * weight +
          9.16 * weeksPregnant,
        -779.72 -
          2.04 * age +
          18.45 * height +
          8.73 * weight +
          9.16 * weeksPregnant,
      ];
      tee = calculateTEE(equations);
    } else if (sex === 'FEMALE' && group === 'infant') {
      tee = -69.15 + 80.0 * age + 2.65 * height + 54.15 * weight;
    } else if (sex === 'MALE' && group === 'infant') {
      tee = -716.45 - 1.0 * age + 17.82 * height + 15.06 * weight;
    } else {
      throw new Error('Invalid group or sex');
    }

    return Math.round(tee);
  }

  async createManyNutrientGuidelines() {
    const formattedData = [];

    const formatValue = (value) => {
      if (value === 'ND' || typeof value === 'undefined' || value === null) {
        return 0.0;
      }
      // Ensure the value has up to 6 decimal places
      return parseFloat(parseFloat(value).toFixed(6));
    };

    const addEntries = (groupName, data) => {
      for (const item of data) {
        const nutrientsData = Object.keys(item.nutrients).reduce((acc, key) => {
          const nutrientValue = item.nutrients[key];
          const nutrientMap = {
            // Map the nutrient names to your database fields
            'Vitamin A': 'vitaminA',
            'Vitamin C': 'vitaminC',
            'Vitamin E': 'vitaminE',
            'Vitamin K': 'vitaminK',
            Thiamin: 'vitaminB1',
            Riboflavin: 'vitaminB2',
            Niacin: 'vitaminB3',
            'Vitamin B6': 'vitaminB6',
            Folate: 'folate',
            'Vitamin B12': 'vitaminB12',
            'Total Fiber': 'totalFiber',
            'Linoleic Acid': 'omega3',
            'α-Linolenic Acid': 'omega6',
            Protein: 'protein',
            Calcium: 'calcium',
            Copper: 'copper',
            Iron: 'iron',
            Magnesium: 'magnesium',
            Manganese: 'manganese',
            Phosphorus: 'phosphorus',
            Selenium: 'selenium',
            Zinc: 'zinc',
            Potassium: 'potassium',
          };
          let formattedKey = nutrientMap[key] || key;
          formattedKey =
            formattedKey.charAt(0).toLowerCase() + formattedKey.slice(1);
          acc[formattedKey] = formatValue(nutrientValue);
          return acc;
        }, {});

        formattedData.push({
          groupName,
          ageRange: item.range,
          sex: item.sex === 'any' ? null : item.sex,
          ...nutrientsData,
        });
      }
    };

    nutrientRequirements.lifeStageGroups.forEach((group) => {
      addEntries(group.groupName, group.ages);
    });

    addEntries('Pregnancy', nutrientRequirements.Pregnancy);
    addEntries('Lactation', nutrientRequirements.Lactation);

    try {
      const creationResult = await this.prisma.nutrientGuidelines.createMany({
        data: formattedData,
      });
      return creationResult;
    } catch (error) {
      console.error('Error creating nutrient guidelines: ', error);
      throw error;
    }
  }
  async calculateWeeks() {
    const today = new Date();
    let nextMonday = new Date();
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));

    for (let week = 0; week < 100; week++) {
      const weekName = `Week of ${nextMonday.getDate()}/${
        nextMonday.getMonth() + 1
      }/${nextMonday.getFullYear()}`;

      const existingWeek = await this.prisma.week.findFirst({
        where: { name: weekName },
      });

      if (!existingWeek) {
        const dates = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(nextMonday);
          date.setDate(nextMonday.getDate() + i);
          dates.push(date);
        }

        await this.prisma.week.create({
          data: {
            name: weekName,
            monday: dates[0],
            tuesday: dates[1],
            wednesday: dates[2],
            thursday: dates[3],
            friday: dates[4],
            saturday: dates[5],
            sunday: dates[6],
          },
        });
      }

      nextMonday.setDate(nextMonday.getDate() + 7);
    }

    return 'Weeks calculated successfully';
  }

  async getFamily(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { familyMember: true },
    });
    if (!user.familyMember) {
      throw new Error('User is not linked to any family.');
    }

    return this.prisma.family.findUnique({
      where: { id: user.familyMember.familyId },
      include: { familyMembers: true },
    });
  }
}
