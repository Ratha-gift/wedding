'use client';

import React, { useRef } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';

export default function AntdRegistry({ children }: { children: React.ReactNode }) {
  const cache = useRef<Entity | null>(null);
  if (!cache.current) {
    cache.current = createCache();
  }

  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache.current!, true) }}
    />
  ));

  return <StyleProvider cache={cache.current}>{children}</StyleProvider>;
}
