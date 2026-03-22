const variants = {
  primary:
    "bg-brand-500 hover:bg-brand-600 text-white shadow-sm hover:shadow-md",
  secondary:
    "bg-white border border-gray-200 hover:border-brand-500 text-gray-700 hover:text-brand-600",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
  ghost: "text-brand-500 hover:bg-brand-50",
  outline: "border border-brand-500 text-brand-500 hover:bg-brand-50",
};

const sizes = {
  xs: "px-2.5 py-1 text-xs rounded-md",
  sm: "px-3.5 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-95",
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? "w-full" : "",
        disabled || loading
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer",
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
