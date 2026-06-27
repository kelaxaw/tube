import type { AnalyzeHistoryResponse } from "#/modules/Upload/types";
import type { AiInsights } from "./insights.schema";

export type InsightInput = AnalyzeHistoryResponse;

export type GeneratedInsights = AiInsights & { isFallback: boolean };

export type InsightChunk =
	| { type: "delta"; data: Partial<AiInsights> }
	| { type: "finished"; data: GeneratedInsights }
	| {
			type: "error";
			error: string;
			data: GeneratedInsights;
	  };
export interface AiProvider {
	streamInsights: (input: InsightInput) => AsyncGenerator<InsightChunk>;
}
