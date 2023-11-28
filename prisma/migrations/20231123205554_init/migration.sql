BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [uid] CHAR(36) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [email_verified_at] DATETIME2,
    [password] NVARCHAR(1000) NOT NULL,
    [first_name] VARCHAR(50) NOT NULL,
    [last_name] VARCHAR(50) NOT NULL,
    [gender] NVARCHAR(1000),
    [birthdate] DATETIME2,
    [need_update_password] BIT NOT NULL CONSTRAINT [users_need_update_password_df] DEFAULT 1,
    [isActive] BIT NOT NULL CONSTRAINT [users_isActive_df] DEFAULT 1,
    [expo_token] NVARCHAR(1000),
    [customer_id] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [users_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    [familyMemberId] INT,
    [familyId] INT,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_uid_key] UNIQUE NONCLUSTERED ([uid]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[id_tokens] (
    [id] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [user_id] INT NOT NULL,
    [code] NVARCHAR(1000),
    [expires_at] DATETIME2 NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [id_tokens_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [id_tokens_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [id_tokens_token_key] UNIQUE NONCLUSTERED ([token])
);

-- CreateTable
CREATE TABLE [dbo].[refresh_tokens] (
    [id] NVARCHAR(1000) NOT NULL,
    [refresh_token] VARCHAR(320) NOT NULL,
    [isBlacklisted] BIT NOT NULL CONSTRAINT [refresh_tokens_isBlacklisted_df] DEFAULT 0,
    [user_id] INT NOT NULL,
    [expires_date] DATETIME2 NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [refresh_tokens_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [refresh_tokens_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [refresh_tokens_refresh_token_key] UNIQUE NONCLUSTERED ([refresh_token])
);

-- CreateTable
CREATE TABLE [dbo].[families] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [number_of_members] INT NOT NULL,
    [total_calories_per_day] INT,
    [restriction_sugar] BIT,
    [restriction_peanuts] BIT,
    [restriction_tree_nuts] BIT,
    [restriction_lactose] BIT,
    [restriction_meat] BIT,
    [restriction_spicy] BIT,
    [restriction_bland] BIT,
    [restriction_flavorful] BIT,
    [restriction_chinese] BIT,
    [restriction_japanese] BIT,
    [restriction_korean] BIT,
    [restriction_thai] BIT,
    [restriction_vietnamese] BIT,
    [restriction_italian] BIT,
    [restriction_american] BIT,
    [restriction_mexican] BIT,
    [restriction_indian] BIT,
    [restriction_french] BIT,
    [restriction_german] BIT,
    [restriction_middle_eastern] BIT,
    [breakfast_at_home] INT,
    [lunch_at_home] INT,
    [dinner_at_home] INT,
    [breakfasts_cooked] INT,
    [breakfasts_assembled] INT,
    [lunches_cooked] INT,
    [lunches_assembled] INT,
    [dinners_cooked] INT,
    [dinners_assembled] INT,
    CONSTRAINT [families_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[family_schedules] (
    [id] INT NOT NULL IDENTITY(1,1),
    [familyId] INT NOT NULL,
    [monday] NVARCHAR(1000) NOT NULL,
    [tuesday] NVARCHAR(1000) NOT NULL,
    [wednesday] NVARCHAR(1000) NOT NULL,
    [thursday] NVARCHAR(1000) NOT NULL,
    [friday] NVARCHAR(1000) NOT NULL,
    [saturday] NVARCHAR(1000) NOT NULL,
    [sunday] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [family_schedules_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [family_schedules_familyId_key] UNIQUE NONCLUSTERED ([familyId])
);

-- CreateTable
CREATE TABLE [dbo].[family_members] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [date_of_birth] DATETIME2 NOT NULL,
    [gender] NVARCHAR(1000) NOT NULL,
    [height] FLOAT(53) NOT NULL,
    [weight] FLOAT(53) NOT NULL,
    [activity_level] NVARCHAR(1000) NOT NULL,
    [weight_goal] NVARCHAR(1000) NOT NULL,
    [total_calories_per_day] INT,
    [familyId] INT NOT NULL,
    CONSTRAINT [family_members_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[individual_nutrient_requirements] (
    [id] INT NOT NULL IDENTITY(1,1),
    [familyMemberId] INT,
    [nutrientGuidelineId] INT,
    [vitamin_a] FLOAT(53) NOT NULL,
    [vitamin_c] FLOAT(53) NOT NULL,
    [vitamin_e] FLOAT(53) NOT NULL,
    [vitamin_k] FLOAT(53) NOT NULL,
    [vitamin_b1] FLOAT(53) NOT NULL,
    [vitamin_b2] FLOAT(53) NOT NULL,
    [vitamin_b3] FLOAT(53) NOT NULL,
    [vitamin_b6] FLOAT(53) NOT NULL,
    [folate] FLOAT(53) NOT NULL,
    [vitamin_b12] FLOAT(53) NOT NULL,
    [total_fiber] FLOAT(53) NOT NULL,
    [omega_3] FLOAT(53) NOT NULL,
    [omega_6] FLOAT(53) NOT NULL,
    [protein] FLOAT(53) NOT NULL,
    [calcium] FLOAT(53) NOT NULL,
    [copper] FLOAT(53) NOT NULL,
    [iron] FLOAT(53) NOT NULL,
    [magnesium] FLOAT(53) NOT NULL,
    [manganese] FLOAT(53) NOT NULL,
    [phosphorus] FLOAT(53) NOT NULL,
    [selenium] FLOAT(53) NOT NULL,
    [zinc] FLOAT(53) NOT NULL,
    [potassium] FLOAT(53) NOT NULL,
    CONSTRAINT [individual_nutrient_requirements_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [individual_nutrient_requirements_familyMemberId_key] UNIQUE NONCLUSTERED ([familyMemberId])
);

-- CreateTable
CREATE TABLE [dbo].[nutrient_guidelines] (
    [id] INT NOT NULL IDENTITY(1,1),
    [groupName] NVARCHAR(1000) NOT NULL,
    [ageRange] NVARCHAR(1000) NOT NULL,
    [sex] NVARCHAR(1000),
    [vitamin_a] FLOAT(53) NOT NULL,
    [vitamin_c] FLOAT(53) NOT NULL,
    [vitamin_e] FLOAT(53) NOT NULL,
    [vitamin_k] FLOAT(53) NOT NULL,
    [vitamin_b1] FLOAT(53) NOT NULL,
    [vitamin_b2] FLOAT(53) NOT NULL,
    [vitamin_b3] FLOAT(53) NOT NULL,
    [vitamin_b6] FLOAT(53) NOT NULL,
    [folate] FLOAT(53) NOT NULL,
    [vitamin_b12] FLOAT(53) NOT NULL,
    [total_fiber] FLOAT(53) NOT NULL,
    [omega_3] FLOAT(53) NOT NULL,
    [omega_6] FLOAT(53) NOT NULL,
    [protein] FLOAT(53) NOT NULL,
    [calcium] FLOAT(53) NOT NULL,
    [copper] FLOAT(53) NOT NULL,
    [iron] FLOAT(53) NOT NULL,
    [magnesium] FLOAT(53) NOT NULL,
    [manganese] FLOAT(53) NOT NULL,
    [phosphorus] FLOAT(53) NOT NULL,
    [selenium] FLOAT(53) NOT NULL,
    [zinc] FLOAT(53) NOT NULL,
    [potassium] FLOAT(53) NOT NULL,
    CONSTRAINT [nutrient_guidelines_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[recipes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [ingredient] NVARCHAR(1000) NOT NULL,
    [item_quantity] INT NOT NULL,
    [item_name] NVARCHAR(1000) NOT NULL,
    [serving_size_quantity] INT NOT NULL,
    [serving_size_measure] NVARCHAR(1000) NOT NULL,
    [unit_measure] NVARCHAR(1000) NOT NULL,
    [unit_quantity] INT NOT NULL,
    [volume_measure] NVARCHAR(1000) NOT NULL,
    [volume_quantity] INT NOT NULL,
    [calories_kcal] FLOAT(53) NOT NULL,
    [protein_g] FLOAT(53) NOT NULL,
    [carbohydrate_available_g] FLOAT(53) NOT NULL,
    [carbohydrates_g] FLOAT(53) NOT NULL,
    [total_dietary_fiber_g] FLOAT(53) NOT NULL,
    [dietary_fiber_2016_g] FLOAT(53) NOT NULL,
    [fat_g] FLOAT(53) NOT NULL,
    [saturated_fat_g] FLOAT(53) NOT NULL,
    [trans_fatty_acid_g] FLOAT(53) NOT NULL,
    [cholesterol_mg] FLOAT(53) NOT NULL,
    [sodium_mg] FLOAT(53) NOT NULL,
    [calcium_mg] FLOAT(53) NOT NULL,
    [copper_mg] FLOAT(53) NOT NULL,
    [folate_mcg] FLOAT(53) NOT NULL,
    [folate_dfe_mcg_dfe] FLOAT(53) NOT NULL,
    [folate_food_mcg] FLOAT(53) NOT NULL,
    [iron_mg] FLOAT(53) NOT NULL,
    [magnesium_mg] FLOAT(53) NOT NULL,
    [manganese_mg] FLOAT(53) NOT NULL,
    [omega_3] FLOAT(53) NOT NULL,
    [omega_6] FLOAT(53) NOT NULL,
    [phosphorus_mg] FLOAT(53) NOT NULL,
    [potassium_mg] FLOAT(53) NOT NULL,
    [selenium_mcg] FLOAT(53) NOT NULL,
    [vitamin_a] FLOAT(53) NOT NULL,
    [vitamin_c] FLOAT(53) NOT NULL,
    [vitamin_e] FLOAT(53) NOT NULL,
    [vitamin_k] FLOAT(53) NOT NULL,
    [vitamin_b1] FLOAT(53) NOT NULL,
    [vitamin_b2] FLOAT(53) NOT NULL,
    [vitamin_b3] FLOAT(53) NOT NULL,
    [vitamin_b6] FLOAT(53) NOT NULL,
    [vitamin_b12] FLOAT(53) NOT NULL,
    [zinc_mg] FLOAT(53) NOT NULL,
    CONSTRAINT [recipes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[weeks] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [monday] DATETIME2 NOT NULL,
    [tuesday] DATETIME2 NOT NULL,
    [wednesday] DATETIME2 NOT NULL,
    [thursday] DATETIME2 NOT NULL,
    [friday] DATETIME2 NOT NULL,
    [saturday] DATETIME2 NOT NULL,
    [sunday] DATETIME2 NOT NULL,
    CONSTRAINT [weeks_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[family_meal_plans] (
    [id] INT NOT NULL IDENTITY(1,1),
    [familyId] INT NOT NULL,
    [weekId] INT NOT NULL,
    [monday] NVARCHAR(1000) NOT NULL,
    [tuesday] NVARCHAR(1000) NOT NULL,
    [wednesday] NVARCHAR(1000) NOT NULL,
    [thursday] NVARCHAR(1000) NOT NULL,
    [friday] NVARCHAR(1000) NOT NULL,
    [saturday] NVARCHAR(1000) NOT NULL,
    [sunday] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [family_meal_plans_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [idtoken_user_id_idx] ON [dbo].[id_tokens]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [refreshtoken_user_id_idx] ON [dbo].[refresh_tokens]([user_id]);

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_familyMemberId_fkey] FOREIGN KEY ([familyMemberId]) REFERENCES [dbo].[family_members]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_familyId_fkey] FOREIGN KEY ([familyId]) REFERENCES [dbo].[families]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[id_tokens] ADD CONSTRAINT [id_tokens_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[refresh_tokens] ADD CONSTRAINT [refresh_tokens_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[family_schedules] ADD CONSTRAINT [family_schedules_familyId_fkey] FOREIGN KEY ([familyId]) REFERENCES [dbo].[families]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[family_members] ADD CONSTRAINT [family_members_familyId_fkey] FOREIGN KEY ([familyId]) REFERENCES [dbo].[families]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[individual_nutrient_requirements] ADD CONSTRAINT [individual_nutrient_requirements_familyMemberId_fkey] FOREIGN KEY ([familyMemberId]) REFERENCES [dbo].[family_members]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[individual_nutrient_requirements] ADD CONSTRAINT [individual_nutrient_requirements_nutrientGuidelineId_fkey] FOREIGN KEY ([nutrientGuidelineId]) REFERENCES [dbo].[nutrient_guidelines]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[family_meal_plans] ADD CONSTRAINT [family_meal_plans_familyId_fkey] FOREIGN KEY ([familyId]) REFERENCES [dbo].[families]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[family_meal_plans] ADD CONSTRAINT [family_meal_plans_weekId_fkey] FOREIGN KEY ([weekId]) REFERENCES [dbo].[weeks]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
