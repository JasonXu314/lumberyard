-- CreateTable
CREATE TABLE `LogLevel` (
    `tag` VARCHAR(191) NOT NULL,
    `severity` INTEGER NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `LogLevel_tag_key`(`tag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `retention` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logLevel` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `timestamp` VARCHAR(191) NOT NULL,
    `jsonDump` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LogLevel` ADD CONSTRAINT `LogLevel_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogEntry` ADD CONSTRAINT `LogEntry_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogEntry` ADD CONSTRAINT `LogEntry_logLevel_fkey` FOREIGN KEY (`logLevel`) REFERENCES `LogLevel`(`tag`) ON DELETE RESTRICT ON UPDATE CASCADE;
