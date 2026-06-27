import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { queryKeys } from "#/common/lib/queryKeys";
import type { FormattedVideo } from "#/common/lib/youtube/types";
import { Button } from "#/common/ui/Button";
import { analyzeHistory } from "#/modules/Upload/api/analyzeHistory";
import { Loading } from "#/modules/Upload/ui/Loading";
import { copyPng, downloadPng, sharePng } from "../lib/exportCard";
import {
	SHARE_CARD_META,
	type ShareCardId,
	ShareCardPreview,
	ShareCardSurface,
} from "./ShareCard";

export function SharePage() {
	const queryClient = useQueryClient();
	const uploadedVideos = queryClient.getQueryData<FormattedVideo[]>(
		queryKeys.history.uploadedVideos(),
	);
	const analysisQuery = useQuery({
		queryKey: queryKeys.history.analysis(),
		queryFn: () => {
			if (!uploadedVideos) {
				throw new Error("Upload your YouTube watch history first.");
			}
			return analyzeHistory({ data: uploadedVideos });
		},
		enabled: Boolean(uploadedVideos),
		staleTime: Number.POSITIVE_INFINITY,
	});

	const [active, setActive] = useState(0);
	const [busy, setBusy] = useState<null | "download" | "share" | "copy">(null);
	const [status, setStatus] = useState<string | null>(null);
	const exportRef = useRef<HTMLDivElement>(null);

	if (analysisQuery.isPending) {
		return (
			<div className="flex justify-center items-center h-[calc(100dvh-76px)]">
				<Loading />
			</div>
		);
	}

	const analysis = analysisQuery.data;

	if (analysisQuery.isError || !uploadedVideos || !analysis) {
		return (
			<main className="container mx-auto flex min-h-[60vh] items-center justify-center px-5">
				<div className="flex max-w-md flex-col items-center gap-4 text-center">
					<h1 className="text-3xl font-semibold">Nothing to share yet</h1>
					<p className="text-sm text-muted-foreground">
						{analysisQuery.error?.message ??
							"Upload your YouTube watch history to generate your wrapped cards."}
					</p>
					<Button asChild size="lg">
						<Link to="/upload">Upload history</Link>
					</Button>
				</div>
			</main>
		);
	}

	const activeCard = SHARE_CARD_META[active];

	const run = async (
		action: "download" | "share" | "copy",
		fn: (node: HTMLElement, id: ShareCardId) => Promise<string | void>,
	) => {
		const node = exportRef.current;
		if (!node || busy) return;
		setBusy(action);
		setStatus(null);
		try {
			const result = await fn(node, activeCard.id);
			if (action === "share") {
				setStatus(
					result === "downloaded"
						? "saved png (share not supported)"
						: "shared",
				);
			} else if (action === "copy") {
				setStatus(result === "link" ? "copied link" : "copied image");
			} else {
				setStatus("downloaded");
			}
		} catch (error) {
			console.error(error);
			setStatus("export failed");
		} finally {
			setBusy(null);
		}
	};

	return (
		<div className="tube-share share-wrap">
			<div className="share">
				<div className="share-head">
					<div className="share-eyebrow">step 08 · the brag</div>
					<h1 className="share-title">
						pick a card. post it. ruin your friends' day.
					</h1>
					<p className="share-sub">
						9:16 cards sized for instagram stories. tap a thumbnail to preview,
						then download.
					</p>
				</div>

				<div className="share-body">
					<div className="share-rail">
						<div className="rail-head">cards · {SHARE_CARD_META.length}</div>
						{SHARE_CARD_META.map((c, i) => (
							<button
								type="button"
								key={c.id}
								className={`rail-card ${i === active ? "active" : ""}`}
								onClick={() => {
									setActive(i);
									setStatus(null);
								}}
							>
								<div className="rail-thumb">
									<ShareCardPreview kind={c.id} analysis={analysis} />
								</div>
								<div className="rail-meta">
									<div className="rail-label">
										{String(i + 1).padStart(2, "0")} · {c.label}
									</div>
									<div className="rail-size">1080 × 1920</div>
								</div>
							</button>
						))}
					</div>

					<div className="share-preview">
						<div className="preview-frame">
							<ShareCardPreview kind={activeCard.id} analysis={analysis} />
						</div>
						<div className="preview-actions">
							<button
								type="button"
								className="cta"
								disabled={Boolean(busy)}
								onClick={() => run("download", downloadPng)}
							>
								{busy === "download" ? "rendering…" : "download png"}
							</button>
							<button
								type="button"
								className="cta ghost"
								disabled={Boolean(busy)}
								onClick={() => run("share", sharePng)}
							>
								{busy === "share" ? "…" : "share"}
							</button>
							<button
								type="button"
								className="cta ghost"
								disabled={Boolean(busy)}
								onClick={() => run("copy", copyPng)}
							>
								{busy === "copy" ? "…" : "copy"}
							</button>
						</div>
						<div className="preview-foot">
							<span>{status ?? "tube watermark included"}</span>
							<span>·</span>
							<span>
								card {active + 1} of {SHARE_CARD_META.length}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Hidden full-size 1080x1920 node captured by the export tools. */}
			<div
				ref={exportRef}
				className="tube-share export-node"
				aria-hidden="true"
			>
				<ShareCardSurface kind={activeCard.id} analysis={analysis} />
			</div>

			<style>{`
        .share-wrap { display: flex; flex-direction: column; min-height: calc(100dvh - 76px); background: var(--bg-0); }
        .share { max-width: 1280px; margin: 0 auto; padding: 36px 40px; display: flex; flex-direction: column; gap: 28px; width: 100%; }
        .share-head { display: flex; flex-direction: column; gap: 12px; }
        .share-eyebrow { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); }
        .share-title { font-size: clamp(36px, 4.5vw, 56px); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; text-wrap: balance; max-width: 800px; }
        .share-sub { font-size: 16px; color: var(--fg-2); max-width: 600px; line-height: 1.5; }
        .share-body { display: grid; grid-template-columns: 280px 1fr; gap: 32px; }
        @media (max-width: 860px) { .share-body { grid-template-columns: 1fr; } }
        .share-rail { display: flex; flex-direction: column; gap: 10px; }
        .rail-head { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--fg-3); padding: 6px 0; }
        .rail-card { display: grid; grid-template-columns: 60px 1fr; gap: 14px; align-items: center; padding: 10px; border: 1px solid var(--line); border-radius: 12px; background: var(--bg-1); transition: all 0.15s ease; text-align: left; }
        .rail-card:hover { border-color: var(--fg-3); }
        .rail-card.active { border-color: var(--accent); background: color-mix(in oklch, var(--accent) 8%, var(--bg-1)); }
        .rail-thumb { width: 60px; aspect-ratio: 9/16; border-radius: 6px; overflow: hidden; background: var(--bg-0); pointer-events: none; }
        .rail-label { font-size: 13px; font-weight: 500; color: var(--fg); }
        .rail-size { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--fg-3); }
        .share-preview { display: flex; flex-direction: column; gap: 18px; align-items: center; }
        .preview-frame { aspect-ratio: 9/16; height: min(560px, 70vh); border-radius: 18px; overflow: hidden; box-shadow: 0 30px 60px oklch(0 0 0 / 0.5); border: 1px solid var(--line); }
        .preview-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .cta { display: inline-flex; align-items: center; gap: 10px; padding: 14px 24px; background: var(--accent); color: white; border-radius: 999px; font-weight: 600; font-size: 15px; transition: transform 0.15s ease, background 0.15s ease; }
        .cta:hover:not(:disabled) { background: var(--accent-bright); transform: translateY(-1px); }
        .cta:disabled { opacity: 0.6; cursor: default; }
        .cta.ghost { background: transparent; color: var(--fg); border: 1px solid var(--line); }
        .cta.ghost:hover:not(:disabled) { background: var(--bg-2); }
        .preview-foot { display: flex; gap: 10px; font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--fg-3); }
        .export-node { position: fixed; left: -99999px; top: 0; width: 1080px; height: 1920px; pointer-events: none; }
      `}</style>
		</div>
	);
}
