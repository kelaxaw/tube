import { ArcElement, Chart as ChartJS, Tooltip } from "chart.js";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { CATEGORIES_COLORS } from "#/common/lib/youtube/constants";
import type { Category } from "#/common/lib/youtube/types";

ChartJS.register(ArcElement, Tooltip);

export function TopCategories({
	categories,
	totalSeconds,
}: {
	categories: Category[];
	totalSeconds: number;
}) {
	const top = categories.slice(0, 8);

	const barColors = categories.map((c) => CATEGORIES_COLORS.get(c.id));

	const data = useMemo(
		() => ({
			labels: categories.map((category) => category.name),
			datasets: [
				{
					label: "categories",
					data: categories.map((category) => category.watchedTime),
					backgroundColor: barColors,
					borderColor: barColors,
					borderWidth: 1,
				},
			],
		}),
		[categories, barColors],
	);

	return (
		<div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
			<div className="flex items-center justify-between">
				<p className="text-xs uppercase tracking-widest text-primary">
					categories
				</p>
				<p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
					share of hours
				</p>
			</div>

			<div className="flex flex-col gap-6">
				<Doughnut data={data} options={{}} />

				<div className="flex flex-1 flex-col gap-1">
					{top.map((c, i) => {
						const pct =
							totalSeconds > 0 ? (c.watchedTime / totalSeconds) * 100 : 0;
						const background = CATEGORIES_COLORS.get(c.id);
						return (
							<div
								key={c.name}
								className="flex items-center gap-2 border-b border-border py-1 text-sm last:border-b-0"
							>
								<span
									className="size-2.5 shrink-0 rounded-sm"
									style={{
										background,
									}}
								/>
								<span className="flex-1 truncate">{c.name}</span>
								<span className="font-mono text-xs text-muted-foreground">
									{pct.toFixed(1)}%
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
