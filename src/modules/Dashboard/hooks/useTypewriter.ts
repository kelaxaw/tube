import { useEffect, useState } from "react";

export function useTypewriter({
	target = [],
	speed = 20,
}: {
	target: string[];
	speed?: number;
}): string[] {
	const [shown, setShown] = useState<string[]>([]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setShown((prev) => {
				const next = target.map((text, idx) => {
					const current = prev[idx] ?? "";
					return current.length >= text.length
						? current
						: text.slice(0, current.length + 1);
				});

				const filled = next.every(
					(s, i) => s.length >= (target[i]?.length ?? 0),
				);

				if (filled) clearInterval(intervalId);

				return next;
			});
		});

		return () => clearInterval(intervalId);
	}, [target.join("\u0000"), speed]);

	return shown;
}
