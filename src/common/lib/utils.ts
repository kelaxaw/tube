import { type ClassValue, clsx } from "clsx";
import { z } from "zod";

export const cn = (...classes: ClassValue[]) => clsx(classes);

export const chunkArray = <T>(arr: T[], size: number): T[][] =>
	Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
		arr.slice(i * size, i * size + size),
	);

const urlSchema = z.url();

export const isUrl = (value: string): boolean =>
	urlSchema.safeParse(value).success;
