import type { Insight } from "#/common/lib/youtube/types";

function formatComparison(multiplier: number) {
  if (multiplier >= 1) return `${multiplier.toFixed(1)}×`;
  return `${Math.round(multiplier * 100)}%`;
}

export function OpportunityCost({
  items,
  hours,
}: {
  items: Insight["opportunityCost"];
  hours: number;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-primary">
          opportunity cost
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          what {hours.toFixed(1)}h could have been
        </p>
      </div>

      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={item.activity}
            className="flex items-center gap-4 border-b border-border py-3 last:border-b-0"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-sm">{item.activity}</span>
              <span className="font-mono text-xs text-muted-foreground">
                ~{item.costHours}h
              </span>
            </div>
            <span className="font-mono text-sm text-primary">
              {formatComparison(item.multiplier)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
