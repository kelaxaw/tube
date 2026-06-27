import { domToBlob, domToPng } from "modern-screenshot";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;

// Cards are designed at a fixed 1080x1920. Capture the unscaled node at 2x for a
// crisp 2160x3840 export. Wait for web fonts so they embed correctly.
async function renderOptions() {
	if (typeof document !== "undefined" && document.fonts) {
		await document.fonts.ready;
	}
	return {
		width: CARD_WIDTH,
		height: CARD_HEIGHT,
		scale: 2,
		backgroundColor: "#000000",
	} as const;
}

function fileName(cardId: string) {
	return `tube-wrapped-${cardId}.png`;
}

export async function downloadPng(node: HTMLElement, cardId: string) {
	const dataUrl = await domToPng(node, await renderOptions());
	const a = document.createElement("a");
	a.href = dataUrl;
	a.download = fileName(cardId);
	document.body.appendChild(a);
	a.click();
	a.remove();
}

/**
 * Native share sheet with the PNG attached (mobile-first). Falls back to a
 * download when the platform can't share files. Returns how it was handled.
 */
export async function sharePng(
	node: HTMLElement,
	cardId: string,
): Promise<"shared" | "downloaded"> {
	const blob = await domToBlob(node, await renderOptions());
	const file = new File([blob], fileName(cardId), { type: "image/png" });

	const nav = navigator as Navigator & {
		canShare?: (data?: ShareData) => boolean;
	};

	if (nav.share && nav.canShare?.({ files: [file] })) {
		try {
			await nav.share({
				files: [file],
				title: "my 2025 in tube",
				text: "my year in watch, wrapped.",
			});
			return "shared";
		} catch (error) {
			// User aborted the share sheet — don't treat as a hard failure.
			if (error instanceof DOMException && error.name === "AbortError") {
				return "shared";
			}
			throw error;
		}
	}

	await downloadPng(node, cardId);
	return "downloaded";
}

/**
 * Copy the PNG to the clipboard. Falls back to copying the page URL when image
 * clipboard writes aren't supported. Returns what was copied.
 */
export async function copyPng(
	node: HTMLElement,
	_cardId: string,
): Promise<"image" | "link"> {
	const canCopyImage =
		typeof ClipboardItem !== "undefined" && Boolean(navigator.clipboard?.write);

	if (canCopyImage) {
		try {
			const blob = await domToBlob(node, await renderOptions());
			await navigator.clipboard.write([
				new ClipboardItem({ "image/png": blob }),
			]);
			return "image";
		} catch {
			// fall through to link copy
		}
	}

	await navigator.clipboard?.writeText(window.location.href);
	return "link";
}
