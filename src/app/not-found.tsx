import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ivory px-6 text-center">
      <div>
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-3 text-5xl font-medium text-maroon-deep">This page has wandered off</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">The link may be old, or the item may no longer be listed.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className="btn btn-primary">Browse the Collection</Link>
          <Link href="/" className="btn btn-outline">Go Home</Link>
        </div>
      </div>
    </main>
  );
}
