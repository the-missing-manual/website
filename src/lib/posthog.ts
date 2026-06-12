import { PostHog } from "posthog-node";

let _client: PostHog | null = null;

export function getPostHogClient(): PostHog {
  if (!_client) {
    _client = new PostHog(process.env.POSTHOG_API_KEY!, {
      host: process.env.POSTHOG_HOST,
      enableExceptionAutocapture: true,
    });
  }
  return _client;
}
