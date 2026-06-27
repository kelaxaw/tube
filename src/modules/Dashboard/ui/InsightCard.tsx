import type { AiInsights } from "#/common/lib/ai/insights.schema";
import { useTypewriter } from "#/modules/Dashboard";

export function InsightCard({
	personality,
	isFallback,
	isStreaming,
}: {
	personality?: AiInsights["personality"];
	isFallback?: boolean;
	isStreaming?: boolean;
}) {
	const [title, description] = useTypewriter({
		target: [personality?.title, personality?.description].map((s) => s ?? ""),
		speed: 10,
	});

	return (
		<div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/30 p-7">
			<div className="flex items-center justify-between">
				<p className="text-xs uppercase tracking-widest text-primary">
					verdict by ai
				</p>
				{isFallback && (
					<span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
						predefined · ai down
					</span>
				)}
			</div>

			{personality?.title && (
				<h2 className="text-2xl leading-snug font-medium tracking-tight">
					<span className="bg-primary px-1 text-background">{title}</span>
				</h2>
			)}

			<p className="text-base leading-relaxed text-muted-foreground">
				{description}
				{isStreaming && <span className="animate-pulse">▋</span>}
			</p>

			{!isStreaming && personality?.badges && (
				<div className="flex flex-wrap gap-2">
					{personality.badges.map((badge) => (
						<span
							key={badge}
							className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs lowercase tracking-wide"
						>
							{badge}
						</span>
					))}
				</div>
			)}
		</div>
	);
}
