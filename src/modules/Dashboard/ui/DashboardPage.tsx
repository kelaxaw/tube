import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { queryKeys } from "#/common/lib/queryKeys";
import type { FormattedVideo } from "#/common/lib/youtube/types";
import { Button } from "#/common/ui/Button";
import {
	InsightCard,
	OpportunityCost,
	TopCategories,
	TopChannels,
	WatchTimeStats,
} from "#/modules/Dashboard";
import { analyzeHistory } from "#/modules/Upload/api/analyzeHistory";
import { Loading } from "#/modules/Upload/ui/Loading";

export function DashboardPage() {
	const queryClient = useQueryClient();
	const uploadedVideos = queryClient.getQueryData<FormattedVideo[]>(
		queryKeys.history.uploadedVideos(),
	);
	const analysisQuery = useQuery({
		queryKey: queryKeys.history.analysis(),
		queryFn: () => {
			if (!uploadedVideos) {
				throw new Error("Upload your YouTube watch history first.");
			}

			return analyzeHistory({ data: uploadedVideos });
		},
		enabled: Boolean(uploadedVideos),
		staleTime: Number.POSITIVE_INFINITY,
	});

	if (analysisQuery.isPending)
		return (
			<div className="flex justify-center items-center h-[calc(100dvh-76px)]">
				<Loading />
			</div>
		);

	if (analysisQuery.isError) {
		return (
			<main className="container mx-auto flex min-h-[60vh] items-center justify-center px-5">
				<div className="flex max-w-md flex-col items-center gap-4 text-center">
					<h1 className="text-3xl font-semibold">Analysis failed</h1>
					<p className="text-sm text-muted-foreground">
						{analysisQuery.error.message}
					</p>
					<Button asChild size="lg">
						<Link to="/upload">Try another file</Link>
					</Button>
				</div>
			</main>
		);
	}

	const analysis = analysisQuery.data;

	if (!uploadedVideos || !analysis) {
		return (
			<main className="container mx-auto flex min-h-[60vh] items-center justify-center px-5">
				<div className="flex max-w-md flex-col items-center gap-4 text-center">
					<h1 className="text-3xl font-semibold">No dashboard data yet</h1>
					<p className="text-sm text-muted-foreground">
						Upload your YouTube watch history to generate the dashboard.
					</p>
					<Button asChild size="lg">
						<Link to="/upload">Upload history</Link>
					</Button>
				</div>
			</main>
		);
	}

	const totalSeconds = analysis.watchTime.hours * 3600;

	return (
		<main className="container mx-auto flex flex-col gap-8 px-5 py-8">
			<div className="flex items-center justify-between gap-4">
				<p className="text-xs uppercase tracking-widest text-muted-foreground">
					your 2025, wrapped
				</p>
				<Button asChild size="sm">
					<Link to="/share">Share your wrapped →</Link>
				</Button>
			</div>

			<WatchTimeStats watchTime={analysis.watchTime} />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<TopChannels channels={analysis.topChannels} />
				</div>
				<TopCategories
					categories={analysis.topCategories}
					totalSeconds={totalSeconds}
				/>
			</div>

			<InsightCard insight={analysis.insight} />

			<OpportunityCost
				items={analysis.insight.opportunityCost}
				hours={analysis.watchTime.hours}
			/>
		</main>
	);
}
