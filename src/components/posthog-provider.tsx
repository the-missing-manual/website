'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';

export function PostHogProvider() {
  useEffect(() => {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, []);

  return null;
}
