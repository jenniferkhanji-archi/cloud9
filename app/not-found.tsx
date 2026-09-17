import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream font-sans">
      <div className="mx-auto flex max-w-md flex-col items-center px-4 text-center">
        <h1 className="font-serif text-3xl font-medium text-espresso">Lost in the clouds.</h1>
        <p className="mt-3 text-stone-600">We couldn&apos;t find that page.</p>
        <Link
          href="/"
          className="mt-8 rounded-full border-2 border-espresso bg-dusty-blue px-6 py-3 text-sm font-semibold text-cream shadow-hard-sm"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
