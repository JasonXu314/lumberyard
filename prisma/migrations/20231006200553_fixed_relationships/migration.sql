-- DropForeignKey
ALTER TABLE `LogEntry` DROP FOREIGN KEY `LogEntry_logLevel_fkey`;

-- DropIndex
DROP INDEX `LogLevel_tag_key` ON `LogLevel`;

-- AlterTable
ALTER TABLE `LogLevel` ADD PRIMARY KEY (`tag`, `projectId`);

-- AddForeignKey
ALTER TABLE `LogEntry` ADD CONSTRAINT `LogEntry_logLevel_projectId_fkey` FOREIGN KEY (`logLevel`, `projectId`) REFERENCES `LogLevel`(`tag`, `projectId`) ON DELETE RESTRICT ON UPDATE CASCADE;
