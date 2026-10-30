# Next.js rendering strategy demo

Next.js App Router + TypeScript + Tailwind CSS + Redux Toolkit. Small local mock data source; no external API or account required.

## Start

Use Node.js 22.12+ or a supported newer version.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For real production caching behavior:

```sh
npm run build
npm start
```

## Interview answer

| Data | Choice | Why |
| --- | --- | --- |
| Private, dynamic profile | Dynamic server rendering (SSR) | Read the current request's verified user on the server; do not share-cache their private data. |
| Public blog, changes daily | ISR on /blog; daily cached data inside the dynamic dashboard | Reuse public content and refresh it without rebuilding on every request. |
| Interactive blog search | Client Component with Redux | Input state needs browser interactivity. The posts still arrive from the server. |

SSG alone would keep blog content until a rebuild. ISR adds timed/on-demand regeneration. Client-side fetching is another valid profile choice when a loading state is acceptable or live polling is needed; it still requires server-side authentication and authorization. We choose SSR to show the profile in the initial server response.

IMPORTANT: the mixed dashboard is dynamically rendered as a route. Its cached blog data does not make half the route classic page-level ISR. The separate public /blog route demonstrates actual page-level ISR.

## Read these files in order

1. `lib/data.ts`: getProfile reads cookies on each request. getBlogPosts wraps a JSON-file read in unstable_cache with revalidate: 86400 and a tag.
2. `app/page.tsx`: a Server Component loads both data sources and renders the dashboard.
3. `app/blog/page.tsx`: public Server Component with export const revalidate = 86400.
4. `components/BlogList.tsx`: 'use client' enables input events and Redux hooks. It gets public posts as props; it does not refetch them.
5. `lib/store.ts` and `components/StoreProvider.tsx`: Redux stores only the search text. Each Provider gets its own store; no server singleton and no private profile in Redux.
6. `app/actions.ts`: server actions change the mock name and demonstrate cache invalidation.

Wrapping server-rendered children in a client Provider does not convert those children into Client Components. A Client Component can still have initial HTML rendered on the server; 'use client' does not mean client-side fetching or no SSR.

## Caching and revalidation

- `cookies()` makes the dashboard dynamic. The profile function is not cached. In a real application, verify the session and query only that user's record. For HTTP profile data, use fetch(url, { cache: 'no-store' }) on the server.
- `unstable_cache(..., { revalidate: 86400, tags: ['marketing-blog'] })` caches our mock CMS query across requests. A real public HTTP source could instead use fetch(url, { next: { revalidate: 86400, tags: ['marketing-blog'] } }).
- `revalidateTag('marketing-blog', 'max')` marks the shared tagged data stale and uses stale-while-revalidate. The next reader may receive the old data while it refreshes in the background.
- `revalidatePath('/blog')` invalidates that route, rather than every consumer of the tag. The demo shows both calls together; either can be used independently depending on what changed.
- One day means eligible for regeneration after 86,400 seconds when traffic arrives. It is not a midnight cron job or an exact daily push. Use a protected CMS webhook for publication-triggered updates.
- Development mode has different caching behavior. Use build/start and full browser reloads to compare timestamps reliably. Client navigation can also reuse the browser's router cache.

This project uses Next.js 16 with Cache Components disabled and the conventional App Router caching APIs. unstable_cache remains supported for this example; the newer opt-in Cache Components model uses 'use cache', cacheLife, and cacheTag instead. Do not enable cacheComponents without migrating the route configuration.

## Try the logic

1. Open the dashboard and save any demo name. Reload: the name remains in that browser's cookie and the profile timestamp changes.
2. Open another browser/private session: its name is independent. This demonstrates request isolation, NOT authentication.
3. In production mode, reload twice: profile time changes but blog fetched time remains the same.
4. Visit /blog: it is pre-rendered with daily revalidation. Search the articles: Redux updates the UI without another data request.
5. In development, edit data/posts.json and press Revalidate blog (demo). Visit /blog and reload after the stale-while-revalidate refresh to see the new data.

The revalidation button and action are development-only. In a real app, protect invalidation with an admin session or verified webhook before enabling it in production. The name cookie is a mock display preference, never a credential. No real private records are included.

## Sources

- https://nextjs.org/docs/app/api-reference/functions/unstable_cache
- https://nextjs.org/docs/app/api-reference/functions/revalidateTag
- https://nextjs.org/docs/app/api-reference/functions/revalidatePath
