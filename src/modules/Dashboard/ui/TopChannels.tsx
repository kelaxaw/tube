import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { CATEGORIES_COLORS } from "#/common/lib/youtube/constants";
import type { Channel } from "#/common/lib/youtube/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/common/ui/Select";

const LIST_LENGTH_OPTIONS = ["7", "15", "30", "60", "100", "all"] as const;

type ListLength = (typeof LIST_LENGTH_OPTIONS)[number];

const ROW_HEIGHT = 68;
const MAX_LIST_HEIGHT = 520;

export function TopChannels({ channels }: { channels: Channel[] }) {
	const parentRef = useRef<HTMLDivElement>(null);
	const [listLength, setListLength] = useState<ListLength>("7");
	const top =
		listLength === "all" ? channels : channels.slice(0, Number(listLength));
	const maxHours = Math.max(...top.map((c) => c.watchedTime / 3600), 1);
	const listHeight = Math.min(top.length * ROW_HEIGHT, MAX_LIST_HEIGHT);
	const rowVirtualizer = useVirtualizer({
		count: top.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ROW_HEIGHT,
		overscan: 8,
	});

	const handleListLengthChange = (value: ListLength) => {
		setListLength(value);
		parentRef.current?.scrollTo({ top: 0 });
	};

	return (
		<div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
			<div className="flex items-center justify-between">
				<p className="text-xs uppercase tracking-widest text-primary">
					top channels
				</p>
				<Select
					value={listLength}
					onValueChange={(value) => handleListLengthChange(value as ListLength)}
				>
					<SelectTrigger
						size="sm"
						className="font-mono uppercase tracking-widest"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent align="end">
						{LIST_LENGTH_OPTIONS.map((option) => (
							<SelectItem key={option} value={option}>
								{option === "all" ? "All" : option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div
				ref={parentRef}
				className="overflow-auto pr-2"
				style={{ height: listHeight }}
			>
				<div
					className="relative w-full"
					style={{ height: rowVirtualizer.getTotalSize() }}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => {
						const c = top[virtualRow.index];

						const barColor = CATEGORIES_COLORS.get(c.categoryId);

						const hours = c.watchedTime / 3600;
						const pct = Math.max(2, (hours / maxHours) * 100);
						return (
							<div
								key={c.name}
								className="absolute top-0 left-0 flex w-full flex-col gap-1.5 border-b border-border py-3"
								style={{
									height: virtualRow.size,
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<div className="flex items-baseline justify-between gap-3">
									<span className="truncate text-base font-medium">
										{String(virtualRow.index + 1).padStart(2, "0")}. {c.name}
										<span className="text-muted-foreground">
											· {c.categoryName}
										</span>
									</span>
									<span className="font-mono text-sm text-muted-foreground">
										{hours.toFixed(1)}h
									</span>
								</div>
								<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full"
										style={{
											width: `${pct}%`,
											background: barColor,
										}}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
