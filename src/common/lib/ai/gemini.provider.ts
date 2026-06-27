import { GoogleGenAI } from "@google/genai";
import { parse } from "best-effort-json-parser";
import { z } from "zod";
import { STATIC_CATALOG, STATIC_PERSONALITY } from "./fallback";
import { InsightsSchema } from "./insights.schema";
import { SYSTEM } from "./prompts";
import type { AiProvider, InsightChunk, InsightInput } from "./types";

// zod v4 -> JSON Schema. Strip $schema; Gemini's responseJsonSchema rejects it.
const { $schema, ...RESPONSE_SCHEMA } = z.toJSONSchema(InsightsSchema);

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) throw new Error("No GEMINI_API_KEY setup");
export class GeminiAiProvider implements AiProvider {
	private client = new GoogleGenAI({ apiKey });

	async *streamInsights(input: InsightInput): AsyncGenerator<InsightChunk> {
		try {
			const stream = await this.client.models.generateContentStream({
				model: "gemini-2.5-flash",
				contents: JSON.stringify(input),
				config: {
					systemInstruction: SYSTEM,
					temperature: 0.9,
					responseMimeType: "application/json",
					responseJsonSchema: RESPONSE_SCHEMA,
				},
			});

			let buffer = "";
			let chunkCount = 0;
			const startedAt = Date.now();

			for await (const chunk of stream) {
				const text = chunk.text ?? "";
				console.log(
					`[gemini stream] chunk ${++chunkCount} +${Date.now() - startedAt}ms len=${text.length}`,
				);
				buffer += text;
				yield { type: "delta", data: parse(buffer) };
			}

			console.log(`[gemini stream] done ${chunkCount} chunks in ${Date.now() - startedAt}ms`);

			const parsed = InsightsSchema.parse(JSON.parse(buffer));

			yield { type: "finished", data: { ...parsed, isFallback: false } };
		} catch (error) {
			console.error("generateInsights failed, using fallback:", error);
			let message = "";
			if (error instanceof Error) {
				message = error.message;
			}
			yield {
				type: "error",
				error: message,
				data: {
					personality: STATIC_PERSONALITY,
					opportunityCost: STATIC_CATALOG,
					isFallback: true,
				},
			};
		}
	}
}
