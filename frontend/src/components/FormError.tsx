type FormErrorProps = { error?: string; variant?: "badge" | "inline" };

export default function FormError({ error, variant = "badge" }: FormErrorProps) {
  if (!error) return null;

  if (variant === "inline") {
    return (
      <div role="alert" className="mt-1 flex items-start gap-1.5 text-xs text-red-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-3.5 w-3.5 mt-1 text-red-600"
        >
          <path
            fillRule="evenodd"
            d="M9.401 2.185a1.25 1.25 0 011.198 0l7.25 4.023c.407.226.651.653.651 1.118v7.348a1.25 1.25 0 01-.651 1.118l-7.25 4.023a1.25 1.25 0 01-1.198 0l-7.25-4.023A1.25 1.25 0 011.5 14.674V7.326c0-.465.244-.892.651-1.118l7.25-4.023zM9 6.25a1 1 0 112 0v4.5a1 1 0 11-2 0v-4.5zM10 15a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 15z"
            clipRule="evenodd"
          />
        </svg>
        <span className="leading-5">{error}</span>
      </div>
    );
  }

  return (
    <div role="alert" className="mt-1 flex items-start gap-2 text-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="h-4 w-4 mt-1.5 text-red-600"
      >
        <path
          fillRule="evenodd"
          d="M9.401 2.185a1.25 1.25 0 011.198 0l7.25 4.023c.407.226.651.653.651 1.118v7.348a1.25 1.25 0 01-.651 1.118l-7.25 4.023a1.25 1.25 0 01-1.198 0l-7.25-4.023A1.25 1.25 0 011.5 14.674V7.326c0-.465.244-.892.651-1.118l7.25-4.023zM9 6.25a1 1 0 112 0v4.5a1 1 0 11-2 0v-4.5zM10 15a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 15z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-red-700 bg-red-50 border border-red-200 rounded-md px-2 py-1 w-fit shadow-sm">
        {error}
      </p>
    </div>
  );
}


