-- CreateEnum
CREATE TYPE "NovelContentType" AS ENUM ('TEXT', 'PDF', 'VIDEO', 'AUDIO');

-- CreateEnum
CREATE TYPE "NovelCreationType" AS ENUM ('ORIGINAL', 'AI_GENERATED', 'AI_ASSISTED');

-- CreateEnum
CREATE TYPE "MediaAssetType" AS ENUM ('PDF', 'VIDEO', 'AUDIO', 'IMAGE');

-- CreateEnum
CREATE TYPE "AIGenerationType" AS ENUM ('NOVEL', 'CHAPTER', 'COVER', 'IMAGE', 'AUDIO', 'VIDEO');

-- CreateEnum
CREATE TYPE "AIGenerationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Novel" ADD COLUMN     "contentType" "NovelContentType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "creationType" "NovelCreationType" NOT NULL DEFAULT 'ORIGINAL';

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "novelId" TEXT NOT NULL,
    "type" "MediaAssetType" NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIGeneration" (
    "id" TEXT NOT NULL,
    "novelId" TEXT,
    "userId" TEXT NOT NULL,
    "type" "AIGenerationType" NOT NULL,
    "status" "AIGenerationStatus" NOT NULL,
    "prompt" TEXT,
    "model" TEXT,
    "resultUrl" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AIGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaAsset_novelId_idx" ON "MediaAsset"("novelId");

-- CreateIndex
CREATE INDEX "AIGeneration_userId_idx" ON "AIGeneration"("userId");

-- CreateIndex
CREATE INDEX "AIGeneration_novelId_idx" ON "AIGeneration"("novelId");

-- CreateIndex
CREATE INDEX "AIGeneration_status_idx" ON "AIGeneration"("status");

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIGeneration" ADD CONSTRAINT "AIGeneration_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIGeneration" ADD CONSTRAINT "AIGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
