-- CreateIndex
CREATE INDEX "ReadingProgress_chapterId_idx" ON "ReadingProgress"("chapterId");

-- AddForeignKey
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
