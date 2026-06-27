import { useEffect, useRef } from "react";
import type { GeneratedInsights } from "#/common/lib/ai/types";
import type { AnalyzeHistoryResponse } from "#/modules/Upload/types";

export type ShareCardId = "hours" | "channels" | "personality" | "tradeoff";

export const SHARE_CARD_META: { id: ShareCardId; label: string }[] = [
	{ id: "hours", label: "the hours" },
	{ id: "channels", label: "top 3 channels" },
	{ id: "personality", label: "personality" },
	{ id: "tradeoff", label: "what i could have" },
];

type CardProps = { analysis: AnalyzeHistoryResponse; insights: GeneratedInsights };

function ShareWatermark() {
	return (
		<div className="sw">
			<div className="sw-mark">
				tube<span style={{ color: "var(--accent)" }}>.</span>
			</div>
			<div className="sw-tag">2025 wrapped · gettube.app</div>
			<style>{`
        .sw { position: absolute; left: 80px; bottom: 80px; display: flex; flex-direction: column; gap: 6px; }
        .sw-mark { font-size: 56px; font-weight: 700; letter-spacing: -0.03em; }
        .sw-tag { font-family: var(--mono); font-size: 18px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-3); }
      `}</style>
		</div>
	);
}

const SHARE_CARDS: Record<
	ShareCardId,
	(props: CardProps) => React.ReactElement
> = {
	hours: ({ analysis }) => {
		const { hours, daysOfLife, videoCount } = analysis.watchTime;
		const pctOfYear = Math.min(100, (daysOfLife / 365) * 100);
		return (
			<div className="sc-hours">
				<div className="sc-eyebrow">my 2025 in tube</div>
				<div className="sc-num">{Math.round(hours).toLocaleString()}</div>
				<div className="sc-unit">hours</div>
				<div className="sc-meta">
					<div>
						<b>{daysOfLife.toFixed(1)}</b> days of my life
					</div>
					<div>
						<b>{videoCount.toLocaleString()}</b> videos
					</div>
					<div>
						<b style={{ color: "var(--accent)" }}>{pctOfYear.toFixed(1)}%</b> of
						a calendar year
					</div>
				</div>
				<ShareWatermark />
				<style>{`
          .sc-hours { width: 100%; height: 100%; background: var(--bg-0); padding: 100px 80px; display: flex; flex-direction: column; gap: 24px; position: relative; overflow: hidden; }
          .sc-hours::before { content: ""; position: absolute; right: -200px; top: -100px; width: 700px; height: 700px; background: radial-gradient(circle, color-mix(in oklch, var(--accent) 40%, transparent), transparent 60%); filter: blur(20px); }
          .sc-eyebrow { font-family: var(--mono); font-size: 28px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); position: relative; }
          .sc-num { font-size: 520px; font-weight: 700; letter-spacing: -0.05em; line-height: 0.85; position: relative; }
          .sc-unit { font-size: 90px; font-weight: 700; color: var(--accent); position: relative; letter-spacing: -0.02em; }
          .sc-meta { display: flex; flex-direction: column; gap: 18px; font-size: 36px; color: var(--fg-2); position: relative; margin-top: 40px; padding-top: 40px; border-top: 2px solid var(--line); }
          .sc-meta b { font-weight: 700; color: var(--fg); }
        `}</style>
			</div>
		);
	},

	channels: ({ analysis }) => (
		<div className="sc-ch">
			<div className="sc-eyebrow">my top channels</div>
			<div className="sc-ch-list">
				{analysis.topChannels.slice(0, 3).map((c, i) => (
					<div key={c.name} className="sc-ch-row">
						<div className="sc-ch-rank">{String(i + 1).padStart(2, "0")}</div>
						<div className="sc-ch-info">
							<div className="sc-ch-name">{c.name}</div>
							<div className="sc-ch-meta">
								{(c.watchedTime / 3600).toFixed(1)} hours
								{c.categoryName ? ` · ${c.categoryName}` : ""}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="sc-ch-roast">the channels that ran my year.</div>
			<ShareWatermark />
			<style>{`
        .sc-ch { width: 100%; height: 100%; background: var(--bg-0); padding: 100px 80px; display: flex; flex-direction: column; gap: 48px; position: relative; }
        .sc-eyebrow { font-family: var(--mono); font-size: 28px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); }
        .sc-ch-list { display: flex; flex-direction: column; gap: 36px; flex: 1; justify-content: center; padding: 60px 0; }
        .sc-ch-row { display: grid; grid-template-columns: 120px 1fr; gap: 32px; align-items: center; padding-bottom: 36px; border-bottom: 2px solid var(--line); }
        .sc-ch-row:last-child { border-bottom: 0; }
        .sc-ch-rank { font-family: var(--mono); font-size: 80px; color: var(--accent); }
        .sc-ch-name { font-size: 64px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.05; margin-bottom: 12px; text-wrap: balance; }
        .sc-ch-meta { font-family: var(--mono); font-size: 24px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.12em; }
        .sc-ch-roast { font-size: 36px; color: var(--fg-2); line-height: 1.4; max-width: 720px; }
      `}</style>
		</div>
	),

	personality: ({ insights }) => {
		const { personality, isFallback } = insights;
		return (
			<div className="sc-pers">
				<div className="sc-eyebrow">my 2025 personality</div>
				<div className="sc-pers-card">
					<div className="sc-pers-tag">
						{isFallback ? "predefined · ai down" : "verdict by ai"}
					</div>
					<div className="sc-pers-title">{personality.title}</div>
					<div className="sc-pers-desc">{personality.description}</div>
					<div className="sc-pers-traits">
						{personality.badges.map((t) => (
							<span key={t} className="sc-pers-trait">
								{t}
							</span>
						))}
					</div>
				</div>
				<ShareWatermark />
				<style>{`
          .sc-pers { width: 100%; height: 100%; background: var(--bg-0); padding: 100px 80px; display: flex; flex-direction: column; gap: 60px; position: relative; }
          .sc-eyebrow { font-family: var(--mono); font-size: 28px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); }
          .sc-pers-card { padding: 80px; background: linear-gradient(135deg, oklch(0.18 0.04 25), oklch(0.22 0.06 25)); border: 2px solid color-mix(in oklch, var(--accent) 50%, transparent); border-radius: 32px; display: flex; flex-direction: column; gap: 36px; flex: 1; justify-content: center; }
          .sc-pers-tag { font-family: var(--mono); font-size: 22px; text-transform: uppercase; letter-spacing: 0.16em; color: var(--accent); }
          .sc-pers-title { font-size: 88px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; text-wrap: balance; }
          .sc-pers-desc { font-size: 36px; line-height: 1.4; color: var(--fg-2); text-wrap: pretty; }
          .sc-pers-traits { display: flex; flex-wrap: wrap; gap: 14px; padding-top: 28px; border-top: 2px solid color-mix(in oklch, var(--accent) 30%, var(--line)); }
          .sc-pers-trait { padding: 14px 28px; border: 2px solid var(--line); border-radius: 999px; font-family: var(--mono); font-size: 22px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--fg-2); }
        `}</style>
			</div>
		);
	},

	tradeoff: ({ analysis, insights }) => (
		<div className="sc-trade">
			<div className="sc-eyebrow">opportunity cost · 2025</div>
			<div className="sc-trade-h">
				with{" "}
				<span className="acc">{Math.round(analysis.watchTime.hours)}h</span>
				<br />i could have...
			</div>
			<div className="sc-trade-list">
				{insights.opportunityCost.slice(0, 4).map((it, i) => (
					<div key={it.activity} className="sc-trade-row">
						<div className="sc-trade-num">{String(i + 1).padStart(2, "0")}</div>
						<div className="sc-trade-text">{it.activity}</div>
					</div>
				))}
			</div>
			<ShareWatermark />
			<style>{`
        .sc-trade { width: 100%; height: 100%; background: var(--bg-0); padding: 100px 80px; display: flex; flex-direction: column; gap: 48px; position: relative; }
        .sc-eyebrow { font-family: var(--mono); font-size: 28px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--accent); }
        .sc-trade-h { font-size: 96px; font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; }
        .sc-trade-h .acc { color: var(--accent); }
        .sc-trade-list { display: flex; flex-direction: column; gap: 24px; flex: 1; }
        .sc-trade-row { display: grid; grid-template-columns: 80px 1fr; gap: 24px; padding: 28px 0; border-bottom: 2px solid var(--line); }
        .sc-trade-num { font-family: var(--mono); font-size: 36px; color: var(--accent); }
        .sc-trade-text { font-size: 38px; font-weight: 500; line-height: 1.3; text-wrap: balance; }
      `}</style>
		</div>
	),
};

/**
 * Renders one card's content at its native 1080x1920 (the card root fills its
 * parent). Used both inside the scaled preview and the hidden export node.
 */
export function ShareCardSurface({
	kind,
	analysis,
	insights,
}: {
	kind: ShareCardId;
	analysis: AnalyzeHistoryResponse;
	insights: GeneratedInsights;
}) {
	const Card = SHARE_CARDS[kind] ?? SHARE_CARDS.hours;
	return <Card analysis={analysis} insights={insights} />;
}

/**
 * A 9:16 card scaled to fit whatever container it lives in. The inner is a fixed
 * 1080x1920 surface transformed down via a ResizeObserver.
 */
export function ShareCardPreview({
	kind,
	analysis,
	insights,
}: {
	kind: ShareCardId;
	analysis: AnalyzeHistoryResponse;
	insights: GeneratedInsights;
}) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const wrap = wrapRef.current;
		const inner = innerRef.current;
		if (!wrap || !inner) return;
		const fit = () => {
			const s = Math.min(wrap.clientWidth / 1080, wrap.clientHeight / 1920);
			inner.style.transform = `scale(${s})`;
		};
		fit();
		const ro = new ResizeObserver(fit);
		ro.observe(wrap);
		return () => ro.disconnect();
	}, []);

	return (
		<div ref={wrapRef} className="share-card-wrap">
			<div ref={innerRef} className="share-card-inner">
				<ShareCardSurface kind={kind} analysis={analysis} insights={insights} />
			</div>
			<style>{`
        .share-card-wrap { width: 100%; height: 100%; position: relative; overflow: hidden; background: var(--bg-0); }
        .share-card-inner { width: 1080px; height: 1920px; transform-origin: top left; position: absolute; left: 0; top: 0; }
      `}</style>
		</div>
	);
}
