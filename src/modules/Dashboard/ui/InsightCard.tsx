import type { Insight } from "#/common/lib/youtube/types";

export function InsightCard({ insight }: { insight: Insight }) {
  const { personality, isFallback } = insight;

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

      <h2 className="text-2xl leading-snug font-medium tracking-tight">
        <span className="bg-primary px-1 text-background">
          {personality.title}
        </span>
      </h2>

      <p className="text-base leading-relaxed text-muted-foreground">
        {personality.description}
      </p>

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
    </div>
  );
}
