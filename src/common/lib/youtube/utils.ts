import { isUrl } from "#/common/lib/utils.ts";
import type { FormattedVideo, TakeoutRawResponse } from "./types";

export const mapTakeoutRaw = (data: TakeoutRawResponse): FormattedVideo[] => {
	return data.map((item) => ({
		title: item.title,
		videoId:
			isUrl(item.titleUrl) && item.titleUrl !== undefined
				? (new URL(item.titleUrl).searchParams.get("v") ?? "")
				: "",
		channelId:
			item.subtitles && item.subtitles[0].url
				? item.subtitles[0].url.split("https://www.youtube.com/channel/")[1]
				: "",
	}));
};

export const parseISO8601Duration = (duration: string): number => {
	const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) return 0;

	const [, hours, minutes, seconds] = match;
	return (
		(Number(hours) || 0) * 3600 +
		(Number(minutes) || 0) * 60 +
		(Number(seconds) || 0)
	);
};
