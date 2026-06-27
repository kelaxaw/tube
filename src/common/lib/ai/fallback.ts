import type { AiInsights } from "./insights.schema";

export const STATIC_PERSONALITY: AiInsights["personality"] = {
	title: "the algorithm's favorite regular",
	description:
		"we couldn't reach the ai to roast you properly, so here's the safe verdict: you watch a lot, you mean well, and the recommended tab knows you better than your friends do.",
	badges: ["consistent", "curious", "easily nerd-sniped"],
};

export const STATIC_CATALOG: AiInsights["opportunityCost"] = [
	{ activity: "learned conversational spanish", costHours: 150 },
	{ activity: "read 23 average-length novels", costHours: 150 },
	{ activity: "trained for a marathon", costHours: 120 },
	{ activity: "got a private pilot's license", costHours: 135 },
	{ activity: "built and shipped a small side project", costHours: 80 },
];
