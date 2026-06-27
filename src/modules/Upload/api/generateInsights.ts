import { createServerFn } from "@tanstack/react-start";
import { AiClient } from "#/common/lib/ai/client";
import type { AnalyzeHistoryResponse } from "../types";

export const generateInsights = createServerFn({ method: "POST" })
	.validator((data: AnalyzeHistoryResponse) => data)
	.handler(async function* ({ data }) {
		yield* AiClient.streamInsights(data);
	});
