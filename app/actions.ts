'use server';

import { cookies } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function saveDemoName(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim().slice(0, 60);
  const cookieStore = await cookies();
  cookieStore.set('demo-name', name, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 86400 });
  revalidatePath('/');
}

export async function refreshBlog() {
  // Development-only teaching button. A real CMS action must verify admin access.
  if (process.env.NODE_ENV !== 'development') throw new Error('Demo revalidation is development-only.');
  // Shared data tag: all pages using this tag can get fresh blog data.
  revalidateTag('marketing-blog', 'max');
  // Route-specific invalidation: rebuild the public blog route on its next visit.
  revalidatePath('/blog');
}
