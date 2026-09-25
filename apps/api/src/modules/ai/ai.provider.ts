import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn(
    "OPENAI_API_KEY is not configured. AI generation will not work until it is provided.",
  );
}

const openai = new OpenAI({
  apiKey: apiKey || "missing-api-key",
});

type GenerateTextInput = {
  prompt: string;
  type: "NOVEL" | "CHAPTER";
};

export async function generateText({
  prompt,
  type,
}: GenerateTextInput) {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await openai.responses.create({
    model: "gpt-5.6-luna",

    instructions:
      type === "NOVEL"
        ? "You are a creative fiction writer. Write engaging, coherent fiction with strong characters, atmosphere, and narrative structure."
        : "You are a creative fiction writer. Write engaging chapters that maintain narrative continuity, character consistency, and strong pacing.",

    input: prompt,
  });

  return {
    text: response.output_text,
    model: "gpt-5.6-luna",
  };
}