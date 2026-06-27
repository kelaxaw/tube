import {
	skipToken,
	experimental_streamedQuery as streamedQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { GeneratedInsights, InsightChunk } from "#/common/lib/ai/types";
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
import { buildStats, generateInsights, Loading } from "#/modules/Upload";

export function DashboardPage() {
	const queryClient = useQueryClient();
	const uploadedVideos = queryClient.getQueryData<FormattedVideo[]>(
		queryKeys.history.uploadedVideos(),
	);
	const youtubeStats = useQuery({
		queryKey: queryKeys.history.analysis(),
		queryFn: () => {
			if (!uploadedVideos) return;

			return buildStats({ data: uploadedVideos });
		},
		enabled: Boolean(uploadedVideos),
		staleTime: Infinity,
	});

	const stats = youtubeStats.data;

	const youtubeInsights = useQuery({
		queryKey: queryKeys.history.insights(),
		queryFn: stats
			? streamedQuery<InsightChunk, Partial<GeneratedInsights>>({
					streamFn: () => generateInsights({ data: stats }),
					reducer: (_acc, chunk) => {
						console.log(
							`[client delta] @${Date.now()} type=${chunk.type} descLen=${chunk.data?.personality?.description?.length ?? 0}`,
						);
						return chunk.data;
					},
					initialValue: {} as Partial<GeneratedInsights>,
					refetchMode: "replace",
				})
			: skipToken,
		staleTime: Infinity,
	});

	if (youtubeStats.isPending)
		return (
			<div className="flex justify-center items-center h-[calc(100dvh-76px)]">
				<Loading />
			</div>
		);

	if (youtubeStats.isError) {
		return (
			<main className="container mx-auto flex min-h-[60vh] items-center justify-center px-5">
				<div className="flex max-w-md flex-col items-center gap-4 text-center">
					<h1 className="text-3xl font-semibold">Analysis failed</h1>
					<p className="text-sm text-muted-foreground">
						{youtubeStats.error.message}
					</p>
					<Button asChild size="lg">
						<Link to="/upload">Try another file</Link>
					</Button>
				</div>
			</main>
		);
	}

	const analysis = youtubeStats.data;

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

			<InsightCard
				personality={youtubeInsights.data?.personality}
				isFallback={youtubeInsights.data?.isFallback}
				isStreaming={youtubeInsights.isFetching}
			/>

			<OpportunityCost
				costs={youtubeInsights.data?.opportunityCost || []}
				hours={analysis.watchTime.hours}
			/>
		</main>
	);
}
