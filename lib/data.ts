import 'server-only';
import { cookies } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type Post = { id: number; title: string; summary: string };

export async function getProfile() {
  // Request-specific data. Never put this function in the shared data cache.
  // Demo only: this cookie is NOT authentication or a verified identity.
  const cookieStore = await cookies();
  return {
    name: cookieStore.get('demo-name')?.value || 'Demo visitor',
    renderedAt: new Date().toISOString(),
  };
}

// A local JSON file stands in for a CMS/database, so no external API is needed.
export const getBlogPosts = unstable_cache(
  async () => {
    const text = await readFile(path.join(process.cwd(), 'data/posts.json'), 'utf8');
    const posts: Post[] = JSON.parse(text);
    return { posts, fetchedAt: new Date().toISOString() };
  },
  ['marketing-blog-v1'],
  { revalidate: 86400, tags: ['marketing-blog'] },
);
