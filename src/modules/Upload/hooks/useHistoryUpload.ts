import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "#/common/lib/queryKeys";
import type {
	FormattedVideo,
	TakeoutRawResponse,
} from "#/common/lib/youtube/types";
import { mapTakeoutRaw } from "#/common/lib/youtube/utils";

export function useHistoryUpload() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: queryKeys.history.upload(),
		mutationFn: async (file: File): Promise<FormattedVideo[]> => {
			const text = await file.text();
			const raw = JSON.parse(text) as TakeoutRawResponse;

			return mapTakeoutRaw(raw);
		},
		onSuccess: (mappedVideos) => {
			queryClient.setQueryData(
				queryKeys.history.uploadedVideos(),
				mappedVideos,
			);
			queryClient.removeQueries({
				queryKey: queryKeys.history.analysis(),
			});
		},
	});
}
