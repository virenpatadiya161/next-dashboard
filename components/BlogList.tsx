'use client';

import { useDispatch, useSelector } from 'react-redux';
import { setSearch, type AppDispatch, type RootState } from '../lib/store';
import type { Post } from '../lib/data';

export default function BlogList({ posts }: { posts: Post[] }) {
  const search = useSelector((state: RootState) => state.ui.search);
  const dispatch = useDispatch<AppDispatch>();
  const term = search.trim().toLowerCase();
  const visiblePosts = posts.filter(post => `${post.title} ${post.summary}`.toLowerCase().includes(term));

  return <div>
    <label htmlFor="blog-search" className="text-sm font-medium">Search articles</label>
    <input id="blog-search" type="search" value={search}
      onChange={event => dispatch(setSearch(event.target.value))}
      className="mt-2 mb-4 w-full rounded-lg border border-slate-300 p-3 outline-indigo-600" />
    <p role="status" className="mb-3 text-xs text-slate-500">{visiblePosts.length} articles</p>
    <ul className="divide-y divide-slate-100">
      {visiblePosts.map(post => <li key={post.id} className="py-4">
        <h3 className="font-semibold">{post.title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{post.summary}</p>
      </li>)}
    </ul>
    {visiblePosts.length === 0 && <p className="text-sm text-slate-600">No matching articles.</p>}
  </div>;
}
