import { createFileRoute } from "@tanstack/react-router";
import { WelcomePage } from "#/modules/Welcome";

export const Route = createFileRoute("/")({ component: WelcomePage });
