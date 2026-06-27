import { createFileRoute } from '@tanstack/react-router'
import { UploadPage } from "#/modules/Upload";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
});
