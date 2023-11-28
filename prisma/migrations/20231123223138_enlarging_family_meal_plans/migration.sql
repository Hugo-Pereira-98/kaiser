/*
  Warnings:

  - You are about to alter the column `monday` on the `family_meal_plans` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(Max)`.
  - You are about to alter the column `tuesday` on the `family_meal_plans` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(Max)`.
  - You are about to alter the column `wednesday` on the `family_meal_plans` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(Max)`.
  - You are about to alter the column `thursday` on the `family_meal_plans` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(Max)`.
  - You are about to alter the column `friday` on the `family_meal_plans` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(Max)`.
  - You are about to alter the column `saturday` on the `family_meal_plans` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(Max)`.
  - You are about to alter the column `sunday` on the `family_meal_plans` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(Max)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[family_meal_plans] ALTER COLUMN [monday] VARCHAR(max) NOT NULL;
ALTER TABLE [dbo].[family_meal_plans] ALTER COLUMN [tuesday] VARCHAR(max) NOT NULL;
ALTER TABLE [dbo].[family_meal_plans] ALTER COLUMN [wednesday] VARCHAR(max) NOT NULL;
ALTER TABLE [dbo].[family_meal_plans] ALTER COLUMN [thursday] VARCHAR(max) NOT NULL;
ALTER TABLE [dbo].[family_meal_plans] ALTER COLUMN [friday] VARCHAR(max) NOT NULL;
ALTER TABLE [dbo].[family_meal_plans] ALTER COLUMN [saturday] VARCHAR(max) NOT NULL;
ALTER TABLE [dbo].[family_meal_plans] ALTER COLUMN [sunday] VARCHAR(max) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
