import BlogList from '../components/BlogList';
import { getBlogPosts, getProfile } from '../lib/data';
import { refreshBlog, saveDemoName } from './actions';

// Server Component. cookies() in getProfile makes this route request-rendered.
// The blog data still has its own independent shared cache.
export default async function Dashboard() {
  const [profile, blog] = await Promise.all([getProfile(), getBlogPosts()]);
  return <main>
    <h1 className="text-3xl font-bold">Your dashboard</h1>
    <p className="mt-2 mb-8 text-slate-600">Fresh profile data. Daily cached stories.</p>
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Profile · dynamic SSR</p>
        <h2 className="mt-3 text-xl font-bold">Hello, {profile.name}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Read on the server for each request. This profile is never stored in the shared data cache.</p>
        <form action={saveDemoName} className="mt-5">
          <label htmlFor="name" className="text-sm font-medium">Demo display name</label>
          <input id="name" name="name" required maxLength={60} defaultValue={profile.name === 'Demo visitor' ? '' : profile.name}
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 outline-indigo-600" />
          <button className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">Save demo name</button>
        </form>
        <p className="mt-5 text-xs leading-5 text-slate-500">Mock identity only; this is not a login system.</p>
        <p className="mt-2 break-all text-xs text-slate-500">Profile rendered: <time>{profile.renderedAt}</time></p>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Blog · 24-hour data cache</p>
        <h2 className="mt-3 mb-5 text-xl font-bold">Latest stories</h2>
        <BlogList posts={blog.posts} />
        <p className="mt-4 break-all text-xs text-slate-500">Blog fetched: <time>{blog.fetchedAt}</time></p>
        {process.env.NODE_ENV === 'development' && <form action={refreshBlog} className="mt-4">
          <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Revalidate blog (demo)</button>
        </form>}
      </section>
    </div>
  </main>;
}
