'use client';

import { useRef, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from '../lib/store';

export default function StoreProvider({ children }: { children: ReactNode }) {
  const store = useRef<AppStore | null>(null);
  if (!store.current) store.current = makeStore();
  return <Provider store={store.current}>{children}</Provider>;
}
