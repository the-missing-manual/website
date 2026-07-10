"use client";

import posthog from "posthog-js";
import { useState } from "react";

interface PageFeedbackProps {
  /** Route of the current page, e.g. `/choice/list`. */
  path?: string;
  /** GitHub URL that opens this page's source file for editing. */
  editUrl?: string;
  /** GitHub URL that opens a pre-filled "new issue" for this page. */
  issueUrl?: string;
}

type Answer = "idle" | "yes" | "no";

/**
 * Per-page feedback prompt. Captures a `docs_feedback` event in PostHog and
 * points readers at the two lowest-friction ways to fix a page: editing the
 * source directly or opening an issue. Rendered at the end of every docs page
 * by the layout in `press.config.tsx`.
 */
export function PageFeedback({ path, editUrl, issueUrl }: PageFeedbackProps) {
  const [answer, setAnswer] = useState<Answer>("idle");

  function send(helpful: boolean) {
    setAnswer(helpful ? "yes" : "no");
    try {
      posthog.capture("docs_feedback", {
        helpful,
        path:
          path ??
          (typeof window !== "undefined" ? window.location.pathname : undefined),
      });
    } catch {
      // Analytics must never break the page. Swallow.
    }
  }

  return (
    <div className="not-prose mt-14 rounded-xl border border-fd-border bg-fd-card p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          role="status"
          aria-live="polite"
          className="font-medium text-fd-foreground"
        >
          {answer === "idle"
            ? "Was this page helpful?"
            : answer === "yes"
              ? "Thanks — glad it helped."
              : "Thanks — tell us what to fix."}
        </span>

        {answer === "idle" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => send(true)}
              aria-label="Yes, this page was helpful"
              className="inline-flex touch-manipulation items-center gap-1.5 rounded-md border border-fd-border px-3 py-1.5 font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary focus-visible:ring-offset-2 focus-visible:ring-offset-fd-card"
            >
              <ThumbsUp /> Yes
            </button>
            <button
              type="button"
              onClick={() => send(false)}
              aria-label="No, this page needs work"
              className="inline-flex touch-manipulation items-center gap-1.5 rounded-md border border-fd-border px-3 py-1.5 font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary focus-visible:ring-offset-2 focus-visible:ring-offset-fd-card"
            >
              <ThumbsDown /> No
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-fd-border pt-3 text-fd-muted-foreground">
        {editUrl && (
          <a
            href={editUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-sm transition-colors hover:text-fd-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary focus-visible:ring-offset-2 focus-visible:ring-offset-fd-card"
          >
            <Pencil /> Suggest an edit
          </a>
        )}
        {issueUrl && (
          <a
            href={issueUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-sm transition-colors hover:text-fd-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary focus-visible:ring-offset-2 focus-visible:ring-offset-fd-card"
          >
            <Bug /> Report a problem
          </a>
        )}
      </div>
    </div>
  );
}

/* Inline icons keep this client component dependency-free and theme-aware
   (they inherit `currentColor`). */

function ThumbsUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 10v10M2 12v6a2 2 0 0 0 2 2h13.3a2 2 0 0 0 2-1.7l1.1-7a2 2 0 0 0-2-2.3H14V5a2.5 2.5 0 0 0-2.5-2.5L7 10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThumbsDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17 14V4M22 12V6a2 2 0 0 0-2-2H6.7a2 2 0 0 0-2 1.7l-1.1 7a2 2 0 0 0 2 2.3H10v5a2.5 2.5 0 0 0 2.5 2.5L17 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Pencil() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Bug() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 2l1.5 2.5M16 2l-1.5 2.5M9 7h6a3 3 0 0 1 3 3v3a6 6 0 0 1-12 0v-3a3 3 0 0 1 3-3ZM6 13H3M21 13h-3M6 9L3.5 7.5M18 9l2.5-1.5M6 17l-2.5 1.5M18 17l2.5 1.5M12 7v14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
