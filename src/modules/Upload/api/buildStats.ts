import { createServerFn } from "@tanstack/react-start";
import type {
	Category,
	Channel,
	FormattedVideo,
} from "#/common/lib/youtube/types";
import { parseISO8601Duration } from "#/common/lib/youtube/utils";
import type { AnalyzeHistoryResponse } from "../types";
import { enrichVideos } from "./enrichVideos";
import { fetchVideoCategories } from "./fetchCategories";

const secondsInDay = 86_400;

export const buildStats = createServerFn({ method: "POST" })
	.validator((data: FormattedVideo[]) => data)
	.handler(serverFnHandler);

async function serverFnHandler({ data }: { data: FormattedVideo[] }) {
	try {
		const enriched = await enrichVideos(data);

		if (!enriched) throw new Error("Enrich videos crushed with error");

		const categoriesMap = new Map<string, number>();
		const channelsMap = new Map<string, Omit<Channel, "categoryName">>();
		const titlesByChannel = new Map<string, string[]>();
		let totalWatchTime = 0;

		for (const video of enriched) {
			const videoWatchTime = parseISO8601Duration(
				video.contentDetails.duration,
			);

			totalWatchTime += videoWatchTime;

			const channelId = video.snippet.channelId;
			const categoryId = video.snippet.categoryId;

			if (!categoriesMap.has(categoryId)) {
				categoriesMap.set(categoryId, videoWatchTime);
			} else {
				const prev = categoriesMap.get(categoryId);
				prev && categoriesMap.set(categoryId, prev + videoWatchTime);
			}

			const prevChannel = channelsMap.get(channelId);
			channelsMap.set(channelId, {
				categoryId: video.snippet.categoryId,
				name: video.snippet.channelTitle,
				watchedTime: (prevChannel?.watchedTime ?? 0) + videoWatchTime,
			});

			const channelTitles = titlesByChannel.get(channelId) ?? [];
			channelTitles.push(video.snippet.title);
			titlesByChannel.set(channelId, channelTitles);
		}

		const hours = totalWatchTime / 3600;

		const daysOfLife = totalWatchTime / secondsInDay;

		const videoCount = enriched.length;

		const categories = new Map(await fetchVideoCategories());

		const topCategories: Category[] = Array.from(categoriesMap)
			.sort((a, b) => b[1] - a[1])
			.map((item) => ({
				id: item[0],
				name: categories.get(item[0]) || item[0],
				watchedTime: item[1],
			}));

		const topChannels: Channel[] = Array.from(channelsMap)
			.sort((a, b) => b[1].watchedTime - a[1].watchedTime)
			.map((item) => ({
				categoryName: categories.get(item[1].categoryId) || "",
				categoryId: item[1].categoryId,
				name: item[1].name,
				watchedTime: item[1].watchedTime,
			}));

		// ~25 titles, biased toward the most-watched channels
		const titleSample: string[] = [];
		const sampleTarget = 25;
		const seenTitles = new Set<string>();
		const orderedChannelIds = Array.from(channelsMap)
			.sort((a, b) => b[1].watchedTime - a[1].watchedTime)
			.map(([id]) => id);

		for (const channelId of orderedChannelIds) {
			if (titleSample.length >= sampleTarget) break;
			for (const title of titlesByChannel.get(channelId) ?? []) {
				if (titleSample.length >= sampleTarget) break;
				if (seenTitles.has(title)) continue;
				seenTitles.add(title);
				titleSample.push(title);
			}
		}

		const topTitles = titleSample.slice(0, 15);

		const response: AnalyzeHistoryResponse = {
			watchTime: {
				hours,
				daysOfLife,
				videoCount,
			},
			topCategories,
			topChannels,
			topTitles,
		};

		return response;
	} catch (error) {
		console.error(error);
	}
}
