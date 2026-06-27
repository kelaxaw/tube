import type { FormattedVideo } from "#/common/lib/youtube/types";
import { chunkArray } from "#/common/lib/utils";
import type { DataVideoResponse } from "../types";

const API_KEY = process.env.YOUTUBE_API_KEY;

const fetchVideoDetails = async (chunk: string[]) => {
  const response = await fetch(
    `${process.env.YOUTUBE_API_URL}/videos?id=${chunk.join(",")}&part=snippet,contentDetails&key=${API_KEY}`,
  );

  const data = (await response.json()) as DataVideoResponse;

  return data.items;
};

export const enrichVideos = async (data: FormattedVideo[]) => {
  try {
    const ids = data.map((v) => v.videoId);
    const uniqueVideos = [...new Set(ids)];
    const chunks = chunkArray(uniqueVideos, 50);

    const result = await Promise.all(chunks.map(fetchVideoDetails));

    const flatten = result.flat();
    return flatten;
  } catch (err) {
    console.error(err);
  }
};
