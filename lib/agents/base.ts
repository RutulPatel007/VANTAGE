import { z, type ZodSchema } from "zod";

export interface AgentEventMap {
  thinking: { text: string };
  enriching: { entity: string; mode: string; step: number; total: number };
  llm_chunk: { text: string };
  result: { output: unknown };
  error: { message: string };
}

export type AgentEvent =
  | { type: "thinking"; text: string }
  | { type: "enriching"; entity: string; mode: string; step: number; total: number }
  | { type: "llm_chunk"; text: string }
  | { type: "result"; output: unknown }
  | { type: "error"; message: string };

export interface Agent<TInput extends z.ZodTypeAny = ZodSchema> {
  name: string;
  description: string;
  inputSchema: TInput;
  run: (input: z.infer<TInput>) => AsyncGenerator<AgentEvent>;
}
