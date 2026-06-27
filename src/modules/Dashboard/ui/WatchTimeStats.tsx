import { cn } from "#/common/lib/utils";

type WatchTime = {
  hours: number;
  daysOfLife: number;
  videoCount: number;
};

export function WatchTimeStats({ watchTime }: { watchTime: WatchTime }) {
  const { hours, daysOfLife, videoCount } = watchTime;
  const pctOfYear = Math.min(100, (daysOfLife / 365) * 100);
  const avgMinutesPerVideo = videoCount > 0 ? (hours * 60) / videoCount : 0;

  const cells = [
    {
      key: "hours",
      value: hours,
      decimals: hours < 100 ? 1 : 0,
      unit: "h",
      label: "hours watched",
      note: `${(hours / 24).toFixed(1)} full days of footage`,
      accent: false,
    },
    {
      key: "days",
      value: daysOfLife,
      decimals: 1,
      unit: "",
      label: "days of your life",
      note: `${pctOfYear.toFixed(1)}% of a calendar year`,
      accent: true,
    },
    {
      key: "videos",
      value: videoCount,
      decimals: 0,
      unit: "",
      label: "videos played",
      note: `${avgMinutesPerVideo.toFixed(0)} min avg / video`,
      accent: false,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-primary">
          watch time
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          source · watchTime
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        {cells.map((c) => (
          <div
            key={c.key}
            className={cn(
              "flex min-h-[180px] flex-col justify-between gap-6 p-7",
              c.accent
                ? "border-t-2 border-t-primary bg-background"
                : "bg-card",
            )}
          >
            <div
              className={cn(
                "text-6xl font-bold tracking-tight tabular-nums",
                c.accent ? "text-primary" : "text-foreground",
              )}
            >
              {c.value.toFixed(c.decimals)}
              {c.unit && (
                <span className="ml-1 text-2xl text-muted-foreground">
                  {c.unit}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {c.label}
              </p>
              <p className="border-t border-border pt-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
                {c.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
