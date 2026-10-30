import BlogList from '../../components/BlogList';
import { getBlogPosts } from '../../lib/data';

// This public route has no request-specific cookies. Its HTML can use ISR.
export const revalidate = 86400;

export default async function BlogPage() {
  const blog = await getBlogPosts();
  return <main className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Public page · ISR</p>
    <h1 className="mt-3 text-3xl font-bold">The blog</h1>
    <p className="mt-3 mb-6 text-sm leading-6 text-slate-600">Pre-rendered content, eligible for revalidation after one day. Everyone shares the same public content.</p>
    <BlogList posts={blog.posts} />
    <p className="mt-5 text-xs text-slate-500">Blog fetched: <time>{blog.fetchedAt}</time></p>
  </main>;
}
