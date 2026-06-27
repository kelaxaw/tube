export interface TakeoutVideo {
  header: string;
  title: string;
  titleUrl: string;
  subtitles?: Subtitle[];
  time: string;
  products: string[];
  activityControls: string[];
}

export interface Subtitle {
  name: string;
  url: string;
}

export type TakeoutRawResponse = TakeoutVideo[];

export type FormattedVideo = {
  title: string;
  videoId: string;
  channelId: string;
};

export type Channel = {
	categoryName: string;
	categoryId: string;
	name: string;
	// category: string;
	watchedTime: number;
	// videoCount: number;
};

export type Category = {
	id: string;
	name: string;
	watchedTime: number;
};

export type WatchTime = {
	hours: number;
	daysOfLife: number;
	videoCount: number;
};

export type Insight = {
	isFallback: boolean;
	personality: {
		title: string;
		description: string;
		badges: string[];
	};
	opportunityCost: {
		activity: string;
		costHours: number;
		multiplier: number;
	}[];
};
