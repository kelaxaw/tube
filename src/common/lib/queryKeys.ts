export const queryKeys = {
	history: {
		all: ["history"] as const,
		uploadedVideos: () =>
			[...queryKeys.history.all, "uploaded-videos"] as const,
		analysis: () => [...queryKeys.history.all, "analysis"] as const,
		insights: () => [...queryKeys.history.all, "insights"] as const,
		upload: () => [...queryKeys.history.all, "upload"] as const,
	},
};
