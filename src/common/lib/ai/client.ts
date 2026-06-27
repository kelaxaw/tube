import { AntropicProvider } from "./antropic.provider";
import { GeminiAiProvider } from "./gemini.provider";

const AI_PROVIDER = process.env.VITE_AI_PROVIDER as "CLAUDE" | "GEMINI";

const PROVIDERS = {
	CLAUDE: () => new AntropicProvider(),
	GEMINI: () => new GeminiAiProvider(),
};

export const AiClient = PROVIDERS[AI_PROVIDER]();
console.log({ AiClient });
