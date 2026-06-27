// import { Anthropic } from "@anthropic-ai/sdk";
// import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { STATIC_CATALOG, STATIC_PERSONALITY } from "./fallback";
// import { InsightsSchema } from "./insights.schema";
// import { SYSTEM } from "./prompts";
import type { AiProvider, InsightChunk, InsightInput } from "./types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) throw new Error("No GEMINI_API_KEY setup");
export class AntropicProvider implements AiProvider {
	// private client = new Anthropic({ apiKey: this.apiKey });

	async *streamInsights(_input: InsightInput): AsyncGenerator<InsightChunk> {
		yield {
			type: "finished",
			data: {
				personality: STATIC_PERSONALITY,
				opportunityCost: STATIC_CATALOG,
				isFallback: true,
			},
		};
		// try {
		// 	const message = await this.client.messages.parse({
		// 		model: "claude-sonnet-4-6",
		// 		max_tokens: 1024,
		// 		temperature: 0.9,
		// 		system: SYSTEM,
		// 		messages: [{ role: "user", content: JSON.stringify(input) }],
		// 		output_config: { format: zodOutputFormat(InsightsSchema) },
		// 	});
		// 	if (!message.parsed_output) throw new Error("Empty parsed_output");
		// 	return { ...message.parsed_output, isFallback: false };
		// } catch (error) {
		// 	console.error("generateInsights failed, using fallback:", error);
		// 	return {
		// 		personality: STATIC_PERSONALITY,
		// 		opportunityCost: STATIC_CATALOG,
		// 		isFallback: true,
		// 	};
		// }
	}
}
