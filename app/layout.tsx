import type { Metadata } from 'next';
import Link from 'next/link';
import StoreProvider from '../components/StoreProvider';
import './globals.css';

export const metadata: Metadata = { title: 'Rendering strategies · Next.js demo', description: 'A simple dashboard demonstrating dynamic data and daily cached content.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="bg-slate-50 text-slate-900">
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav aria-label="Main" className="mb-8 flex gap-5 text-sm font-medium text-indigo-700">
        <Link href="/">Dashboard</Link><Link href="/blog">Public blog</Link>
      </nav>
      <StoreProvider>{children}</StoreProvider>
    </div>
  </body></html>;
}
