import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function* streamAgentResponse({
  prompt,
  systemPrompt,
  mockText,
}: {
  prompt: string;
  systemPrompt: string;
  mockText: string;
}): AsyncGenerator<string> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const words = mockText.split(" ");
    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 18));
      yield `${word} `;
    }
    return;
  }

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: systemPrompt,
    prompt,
  });

  for await (const delta of result.textStream) {
    yield delta;
  }
}
