'use client';

import posthog from 'posthog-js';
import { useEffect, useRef } from 'react';
import { useRouter } from 'waku/router/client';

export function PostHogProvider() {
  const { path } = useRouter();
  const isInitial = useRef(true);

  useEffect(() => {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, []);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    posthog.capture('$pageview', { $current_url: window.location.href });
  }, [path]);

  return null;
}
