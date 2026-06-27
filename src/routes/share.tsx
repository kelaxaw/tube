import { createFileRoute } from "@tanstack/react-router";
import { SharePage } from "#/modules/Share";

export const Route = createFileRoute("/share")({
	component: SharePage,
});
