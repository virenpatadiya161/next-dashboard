'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="rounded-xl bg-white p-6"><h2 className="text-xl font-semibold">Could not load the data.</h2>
    <button onClick={reset} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white">Try again</button></div>;
}
