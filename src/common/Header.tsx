import { Link } from "@tanstack/react-router";

export function Header() {
	return (
		<div className="flex items-center justify-between p-5 border-b border-muted">
			<Link to="/">
				<p className="text-3xl">
					tube<span className="text-primary">.</span>
				</p>
			</Link>

			<div className="flex items-center gap-5">
				<Link
					to="/share"
					className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
				>
					share
				</Link>
				<p className="text-xs text-muted-foreground">
					YOUR WATCH HISTORY, ANALYZED
				</p>
			</div>
		</div>
	);
}
