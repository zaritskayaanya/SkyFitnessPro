'use client';

import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { useMemo } from 'react';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store: AppStore = useMemo(() => makeStore(), []);

  return <Provider store={store}>{children}</Provider>;
}