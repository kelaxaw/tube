import { Link } from "@tanstack/react-router";
import { UploadIcon } from "lucide-react";
import { Button } from "#/common/ui/Button";

export function WelcomePage() {
	return (
		<main className="container mx-auto">
			<div className="flex flex-col gap-2">
				<h1 className="text-8xl font-bold">
					your watch history, finally readable.
				</h1>
				<p className="text-muted-foreground">
					upload your google takeout. get a dashboard of every channel,
					category, and hour you watched. for any time range — last week, last
					month, last year, all of it.
				</p>

				<Button asChild size="lg" className="max-w-44 w-full">
					<Link to="/upload">
						<UploadIcon />
						upload history
					</Link>
				</Button>
			</div>
		</main>
	);
}
