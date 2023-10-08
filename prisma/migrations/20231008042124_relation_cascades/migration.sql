-- DropForeignKey
ALTER TABLE `LogEntry` DROP FOREIGN KEY `LogEntry_logLevel_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `LogEntry` DROP FOREIGN KEY `LogEntry_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `LogLevel` DROP FOREIGN KEY `LogLevel_projectId_fkey`;

-- AddForeignKey
ALTER TABLE `LogLevel` ADD CONSTRAINT `LogLevel_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogEntry` ADD CONSTRAINT `LogEntry_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogEntry` ADD CONSTRAINT `LogEntry_logLevel_projectId_fkey` FOREIGN KEY (`logLevel`, `projectId`) REFERENCES `LogLevel`(`tag`, `projectId`) ON DELETE CASCADE ON UPDATE CASCADE;
