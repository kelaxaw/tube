import type {
	Category,
	Channel,
	Insight,
	WatchTime,
} from "#/common/lib/youtube/types";

export type VideoCategoriesesResponse = {
	kind: string;
	etag: string;
	nextPageToken: string;
	prevPageToken: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: VideoResource[];
};

type VideoResource = {
	kind: string;
	etag: string;
	id: string;
	snippet: {
		channelId: string;
		title: string;
		assignable: boolean;
	};
};

export interface DataVideoResponse {
	kind: string;
	etag: string;
	items: Item[];
}

export interface Item {
	kind: string;
	etag: string;
	id: string;
	snippet: Snippet;
	contentDetails: ContentDetails;
}

export interface Snippet {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
	thumbnails: Thumbnails;
	channelTitle: string;
	categoryId: string;
	liveBroadcastContent: string;
	defaultLanguage: string;
	localized: Localized;
}

export interface Thumbnails {
	default: Default;
	medium: Medium;
	high: High;
	standard: Standard;
	maxres: Maxres;
}

export interface Default {
	url: string;
	width: number;
	height: number;
}

export interface Medium {
	url: string;
	width: number;
	height: number;
}

export interface High {
	url: string;
	width: number;
	height: number;
}

export interface Standard {
	url: string;
	width: number;
	height: number;
}

export interface Maxres {
	url: string;
	width: number;
	height: number;
}

export interface Localized {
	title: string;
	description: string;
}

export interface ContentDetails {
	duration: string;
	dimension: string;
	definition: string;
	caption: string;
	licensedContent: boolean;
	contentRating: ContentRating;
	projection: string;
}

export type ContentRating = {};

export type AnalyzeHistoryResponse = {
	watchTime: WatchTime;
	topChannels: Channel[];
	topCategories: Category[];
	topTitles: string[];
};
