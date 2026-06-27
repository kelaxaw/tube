import { createServerFn } from "@tanstack/react-start";
import type { VideoCategoriesesResponse } from "../types";

const API_KEY = process.env.YOUTUBE_API_KEY;

const mapCategories = (data: VideoCategoriesesResponse) =>
  data.items.map((item) => [item.id, item.snippet.title]);

export type CategoriesResponse = [string, string][];

const getCategories = async () => {
  try {
    const response = await fetch(
      `${process.env.YOUTUBE_API_URL}/videoCategories?part=snippet&regionCode=RU&key=${API_KEY}`,
    );

    const data = await response.json();

    return mapCategories(data) as CategoriesResponse;
  } catch (err) {
    console.error(err);
  }
};

export const fetchVideoCategories = createServerFn({ method: "GET" }).handler(
  getCategories,
);
