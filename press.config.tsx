import { defineConfig } from "fumapress";
import { createRootLayout } from "fumapress/layouts/root";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { flexsearchPlugin } from "fumapress/plugins/flexsearch";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { sitemapPlugin } from "fumapress/plugins/sitemap";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { Mark } from "./src/components/mark";
import { PageFeedback } from "./src/components/page-feedback";
import { PostHogProvider } from "./src/components/posthog-provider";
import { docs } from "./.source/server";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { readFileSync } from "fs";
import { relative, sep } from "node:path";
import { createRequire } from "module";
import type { ReactNode } from "react";

const GREEN = "#4ade80";
const BG = "#0c0c0c";

const _require = createRequire(import.meta.url);

function loadFontSync(pkg: string, file: string): ArrayBuffer {
  const path = _require.resolve(`${pkg}/files/${file}`);
  const buf = readFileSync(path);
  return buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength,
  ) as ArrayBuffer;
}

const FumapressRoot = createRootLayout();

function RootLayout({ children, lang }: { children: ReactNode; lang?: string }) {
  return (
    <FumapressRoot lang={lang}>
      <PostHogProvider />
      {children}
    </FumapressRoot>
  );
}

const BASE_URL = "https://the-missing-manual.vercel.app";
const SITE_NAME = "The Missing Manual";
const REPO_URL = "https://github.com/the-missing-manual/website";
const REPO_BRANCH = "main";

export default defineConfig({
  content: docs.toFumadocsSource(),
  site: {
    name: SITE_NAME,
    baseUrl: BASE_URL,
    git: {
      user: "the-missing-manual",
      repo: "website",
      branch: REPO_BRANCH,
      rootDir: process.cwd(),
    },
  },
  meta: {
    root() {
      return (
        <>
          <meta property="og:site_name" content={SITE_NAME} />
        </>
      );
    },
    page(page) {
      const pageUrl = page.url ? new URL(page.url, BASE_URL).href : BASE_URL;
      const imagePath = (() => {
        const slugs = page.slugs ?? [];
        const segments = [...slugs];
        if (segments.length === 0) segments.push("index.webp");
        else segments[segments.length - 1] += ".webp";
        return new URL(segments.join("/"), BASE_URL).href;
      })();

      return (
        <>
          {page.data.description && (
            <meta name="description" content={page.data.description} />
          )}
          <meta property="og:url" content={pageUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={page.data.title} />
          {page.data.description && (
            <meta name="twitter:description" content={page.data.description} />
          )}
          <meta name="twitter:image" content={imagePath} />
        </>
      );
    },
  },
})
  .layouts({
    root: RootLayout,
    page: createDocsLayoutPage({
      async render(page) {
        // Reproduce the default body rendering so we can append a feedback
        // footer to every page without touching each MDX file.
        const adapters = (this as unknown as { adapters: unknown[] }).adapters;
        let body: ReactNode;
        for (const adapter of adapters) {
          const render = (adapter as Record<string, unknown>)[
            "core:render-body"
          ] as
            | ((this: unknown, page: unknown) => Promise<ReactNode>)
            | undefined;
          const result = await render?.call(this, page);
          if (result !== undefined) {
            body = result;
            break;
          }
        }

        const relPath = page.absolutePath
          ? relative(process.cwd(), page.absolutePath).replaceAll(sep, "/")
          : undefined;
        const editUrl = relPath
          ? `${REPO_URL}/edit/${REPO_BRANCH}/${relPath}`
          : REPO_URL;
        const issueTitle = `Docs feedback: ${page.data.title ?? page.url ?? ""}`;
        const issueBody = `Page: ${page.url ?? relPath ?? ""}\n\nWhat is wrong, missing, or unclear?\n`;
        const issueUrl = `${REPO_URL}/issues/new?labels=feedback&title=${encodeURIComponent(
          issueTitle,
        )}&body=${encodeURIComponent(issueBody)}`;

        return {
          body: (
            <>
              {body}
              <PageFeedback
                key={page.url}
                path={page.url}
                editUrl={editUrl}
                issueUrl={issueUrl}
              />
            </>
          ),
          pageProps: {
            tableOfContent: {
              style: "clerk",
            },
          },
        };
      },
    }),
  })
  .plugins(
    flexsearchPlugin(),
    llmsPlugin(),
    sitemapPlugin(),
    takumiPlugin({
      async generate(page) {
        const boldFont = loadFontSync(
          "@fontsource/bricolage-grotesque",
          "bricolage-grotesque-latin-700-normal.woff",
        );
        const regularFont = loadFontSync(
          "@fontsource/epilogue",
          "epilogue-latin-400-normal.woff",
        );

        const fonts: {
          name: string;
          data: ArrayBuffer;
          weight: number;
          style: "normal";
        }[] = [
          {
            name: "Bricolage Grotesque",
            data: boldFont,
            weight: 700,
            style: "normal",
          },
          {
            name: "Epilogue",
            data: regularFont,
            weight: 400,
            style: "normal",
          },
        ];

        const titleLen = page.data.title?.length ?? 0;
        const titleSize = titleLen > 50 ? 58 : titleLen > 35 ? 68 : 80;

        return {
          node: (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: BG,
                position: "relative",
                fontFamily: "Bricolage Grotesque, system-ui",
              }}
            >
              {/* Ambient green glow — bottom left */}
              <div
                style={{
                  position: "absolute",
                  bottom: -80,
                  left: -80,
                  width: 560,
                  height: 420,
                  background:
                    "linear-gradient(145deg, rgba(74,222,128,0.11) 0%, rgba(74,222,128,0.04) 45%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Top accent line */}
              <div
                style={{
                  width: "100%",
                  height: 3,
                  background: GREEN,
                  flexShrink: 0,
                }}
              />

              {/* Main area */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  padding: "56px 80px 48px",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                {/* Site badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: GREEN,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: GREEN,
                      fontSize: 15,
                      fontWeight: 600,
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                      fontFamily: "Epilogue, system-ui",
                    }}
                  >
                    The Missing Manual
                  </span>
                </div>

                {/* Title + description */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    maxWidth: 960,
                  }}
                >
                  <div
                    style={{
                      margin: 0,
                      padding: 0,
                      fontSize: titleSize,
                      fontWeight: 700,
                      color: "#f5f5f5",
                      lineHeight: 1.07,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {page.data.title}
                  </div>
                  {page.data.description ? (
                    <div
                      style={{
                        margin: 0,
                        padding: 0,
                        fontSize: 22,
                        fontWeight: 400,
                        color: "#6b7280",
                        lineHeight: 1.55,
                        maxWidth: 740,
                        fontFamily: "Epilogue, system-ui",
                      }}
                    >
                      {page.data.description}
                    </div>
                  ) : null}
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: 20,
                    borderTop: "1px solid #1c1c1c",
                    fontFamily: "Epilogue, system-ui",
                  }}
                >
                  <span style={{ color: "#3f3f3f", fontSize: 14 }}>
                    the-missing-manual.vercel.app
                  </span>
                  <span
                    style={{ color: "#242424", fontSize: 14, margin: "0 14px" }}
                  >
                    ·
                  </span>
                  <span style={{ color: "#3f3f3f", fontSize: 14 }}>
                    peer-sourced · honest · practical
                  </span>
                </div>
              </div>

              {/* Decorative right-side lines — like text content, very faint */}
              <div
                style={{
                  position: "absolute",
                  right: 80,
                  bottom: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    width: 96,
                    height: 3,
                    background: "rgba(74,222,128,0.12)",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    width: 140,
                    height: 3,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    width: 72,
                    height: 3,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    width: 120,
                    height: 3,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    width: 48,
                    height: 3,
                    background: "rgba(74,222,128,0.06)",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    width: 110,
                    height: 3,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    width: 88,
                    height: 3,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          ),
          options: { fonts },
        };
      },
    }),
  )
  .adapters(
    fumadocsMdx({
      async getMdxComponents() {
        return {
          ...defaultMdxComponents,
          Mark,
        };
      },
    }),
  );
