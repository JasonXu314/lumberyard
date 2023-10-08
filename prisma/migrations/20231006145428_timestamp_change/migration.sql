/*
  Warnings:

  - Changed the type of `timestamp` on the `LogEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `LogEntry` DROP COLUMN `timestamp`,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL;
