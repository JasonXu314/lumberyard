/*
  Warnings:

  - You are about to alter the column `timestamp` on the `LogEntry` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `jsonDump` on the `LogEntry` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `LogEntry` MODIFY `timestamp` JSON NOT NULL,
    MODIFY `jsonDump` JSON NULL;
