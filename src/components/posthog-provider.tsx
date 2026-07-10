'use client';

import posthog from 'posthog-js';
import { useEffect, useRef } from 'react';
import { useRouter } from 'waku/router/client';

// Waku only exposes env vars prefixed with `WAKU_PUBLIC_` to browser code
// (see waku's environmentsPlugin). Vite's `VITE_` prefix is NOT recognized
// here, so those would silently resolve to `undefined` in the client bundle.
const POSTHOG_KEY = import.meta.env.WAKU_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.WAKU_PUBLIC_POSTHOG_HOST;

export function PostHogProvider() {
  const { path } = useRouter();
  const isInitial = useRef(true);

  useEffect(() => {
    // Skip init entirely when unconfigured. Calling posthog.init(undefined)
    // only logs a warning and then drops every event, which hides the fact
    // that analytics are not actually wired up.
    if (!POSTHOG_KEY) return;

    posthog.init(POSTHOG_KEY, {
      ...(POSTHOG_HOST ? { api_host: POSTHOG_HOST } : {}),
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, []);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    if (!POSTHOG_KEY) return;
    posthog.capture('$pageview', { $current_url: window.location.href });
  }, [path]);

  return null;
}
