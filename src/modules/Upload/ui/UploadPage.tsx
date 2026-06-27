import { useNavigate } from "@tanstack/react-router";
import { useHistoryUpload } from "#/modules/Upload/hooks/useHistoryUpload";
import { FileUpload } from "#/modules/Upload/ui/FileUpload";
import { Loading } from "#/modules/Upload/ui/Loading";

export function UploadPage() {
	const navigate = useNavigate();
	const historyUpload = useHistoryUpload();

	const onFileUpload = async (file: File) => {
		await historyUpload.mutateAsync(file);
		await navigate({ to: "/dashboard" });
	};

	if (historyUpload.isPending) return <Loading />;

	return (
		<section className="container mx-auto pt-5">
			<div className="mx-auto max-w-2xl">
				<FileUpload onUpload={onFileUpload} />
				{historyUpload.isError ? (
					<p className="mt-4 text-sm text-destructive">
						{historyUpload.error.message}
					</p>
				) : null}
			</div>
		</section>
	);
}
