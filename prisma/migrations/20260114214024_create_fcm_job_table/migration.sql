-- CreateTable
CREATE TABLE `fcm_job` (
    `identifier` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `deliverAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fcm_job_identifier_key`(`identifier`),
    PRIMARY KEY (`identifier`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
