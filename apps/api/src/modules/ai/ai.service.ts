import { prisma } from "../../lib/prisma.js";
import { generateText } from "./ai.provider.js";

type CreateGenerationInput = {
  userId: string;
  type: "NOVEL" | "CHAPTER";
  prompt: string;
  novelId?: string;
};

export async function createGeneration({
  userId,
  type,
  prompt,
  novelId,
}: CreateGenerationInput) {
  const generation = await prisma.aIGeneration.create({
    data: {
      userId,
      type,
      prompt,
      novelId: novelId ?? null,
      status: "PENDING",
      model: null,
    },
  });

  return generation;
}

export async function processGeneration(generationId: string, userId: string) {
  const generation = await prisma.aIGeneration.findFirst({
    where: {
      id: generationId,
      userId,
    },
  });

  if (!generation) {
    throw new Error("Generation not found");
  }

  if (!generation.prompt) {
    throw new Error("Generation prompt is missing");
  }

  await prisma.aIGeneration.update({
    where: {
      id: generationId,
    },
    data: {
      status: "PROCESSING",
    },
  });

  try {
    if (generation.type !== "NOVEL" && generation.type !== "CHAPTER") {
      throw new Error(
        `${generation.type} generation is not supported by the text provider yet`,
      );
    }

    const result = await generateText({
      prompt: generation.prompt,
      type: generation.type,
    });

    return await prisma.aIGeneration.update({
      where: {
        id: generationId,
      },
      data: {
        status: "COMPLETED",
        model: result.model,
        resultText: result.text,
        completedAt: new Date(),
        error: null,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI generation failed";

    await prisma.aIGeneration.update({
      where: {
        id: generationId,
      },
      data: {
        status: "FAILED",
        error: message,
      },
    });

    throw error;
  }
}

export async function getGenerationById(generationId: string, userId: string) {
  return prisma.aIGeneration.findFirst({
    where: {
      id: generationId,
      userId,
    },
  });
}
