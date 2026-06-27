import { z } from "zod";

export const InsightsSchema = z.object({
	personality: z.object({
		title: z
			.string()
			.describe("punchy archetype, lowercase, 3-6 words"),
		description: z
			.string()
			.describe("2-3 sentence witty roast, second person ('you...')"),
		badges: z
			.array(z.string())
			.min(3)
			.max(4)
			.describe("single lowercase trait words"),
	}),
	opportunityCost: z
		.array(
			z.object({
				activity: z
					.string()
					.describe("concrete thing they could have done instead"),
				costHours: z
					.number()
					.positive()
					.describe("realistic hours that activity takes"),
			}),
		)
		.length(5),
});

export type AiInsights = z.infer<typeof InsightsSchema>;
