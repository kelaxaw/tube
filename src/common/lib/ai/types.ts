import type { AiInsights } from "./insights.schema";

export type InsightInput = {
	hours: number;
	topChannels: { name: string; watchedTime: number }[];
	topCategories: { name: string; watchedTime: number }[];
	titleSample: string[];
};

export type GenerateInsightsResult = AiInsights & { isFallback: boolean };

export interface AiProvider {
	generateInsights: (input: InsightInput) => Promise<GenerateInsightsResult>;
}
