import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { STATIC_CATALOG, STATIC_PERSONALITY } from "./fallback";
import { InsightsSchema } from "./insights.schema";
import { SYSTEM } from "./prompts";
import type { AiProvider, GenerateInsightsResult, InsightInput } from "./types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) throw new Error("No GEMINI_API_KEY setup");

// zod v4 -> JSON Schema. Strip $schema; Gemini's responseJsonSchema rejects it.
const { $schema, ...RESPONSE_SCHEMA } = z.toJSONSchema(InsightsSchema);

export class GeminiAiProvider implements AiProvider {
	private client = new GoogleGenAI({ apiKey });

	async generateInsights(input: InsightInput): Promise<GenerateInsightsResult> {
		try {
			const response = await this.client.models.generateContent({
				model: "gemini-2.5-flash",
				contents: JSON.stringify(input),
				config: {
					systemInstruction: SYSTEM,
					temperature: 0.9,
					responseMimeType: "application/json",
					responseJsonSchema: RESPONSE_SCHEMA,
				},
			});

			if (!response.text) throw new Error("Empty response text");

			// response.text is JSON matching schema; re-validate to be safe.
			const parsed = InsightsSchema.parse(JSON.parse(response.text));

			return { ...parsed, isFallback: false };
		} catch (error) {
			console.error("generateInsights failed, using fallback:", error);
			return {
				personality: STATIC_PERSONALITY,
				opportunityCost: STATIC_CATALOG,
				isFallback: true,
			};
		}
	}
}
