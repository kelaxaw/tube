import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "w-full min-w-0 rounded-lg bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
  {
    variants: {
      variant: {
        default: "border border-input",
        file: "relative flex items-center justify-center border-2 border-dashed border-input cursor-pointer hover:border-ring/50",
      },
      size: { default: "h-8", file: "h-36" },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Input({
  className,
  type,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  if (variant === "file") {
    return (
      <div className={inputVariants({ variant, size, className })}>
        <span className="text-sm text-muted-foreground pointer-events-none">
          Drop file or click to browse
        </span>
        <input
          type="file"
          data-slot="input"
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
          {...props}
        />
      </div>
    );
  }
  return (
    <input
      type={type}
      data-slot="input"
      className={inputVariants({ variant, size, className })}
      {...props}
    />
  );
}
