import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { flexsearchPlugin } from "fumapress/plugins/flexsearch";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { Mark } from "./src/components/mark";
import { docs } from "./.source/server";
import defaultMdxComponents from "fumadocs-ui/mdx";

const GREEN = "#4ade80";
const BG = "#0c0c0c";

async function loadFont(
  family: string,
  weight: number,
): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      },
    ).then((r) => r.text());
    const url = css.match(/url\(([^)]+)\)/)?.[1];
    if (url) return fetch(url).then((r) => r.arrayBuffer());
  } catch {
    // fall back to system fonts
  }
  return null;
}

export default defineConfig({
  content: docs.toFumadocsSource(),
  site: {
    name: "The Missing Manual",
    baseUrl: "https://the-missing-manual.vercel.app",
  },
})
  .layouts({
    page: createDocsLayoutPage({
      async render(page) {
        return {
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
    takumiPlugin({
      async generate(page) {
        const [boldFont, regularFont] = await Promise.all([
          loadFont("Bricolage Grotesque", 700),
          loadFont("Epilogue", 400),
        ]);

        const fonts: {
          name: string;
          data: ArrayBuffer;
          weight: number;
          style: "normal";
        }[] = [];
        if (boldFont)
          fonts.push({
            name: "Bricolage Grotesque",
            data: boldFont,
            weight: 700,
            style: "normal",
          });
        if (regularFont)
          fonts.push({
            name: "Epilogue",
            data: regularFont,
            weight: 400,
            style: "normal",
          });

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
                fontFamily: boldFont
                  ? "Bricolage Grotesque, system-ui"
                  : "system-ui, sans-serif",
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
                      fontFamily: regularFont
                        ? "Epilogue, system-ui"
                        : "system-ui, sans-serif",
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
                        fontFamily: regularFont
                          ? "Epilogue, system-ui"
                          : "system-ui, sans-serif",
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
                    fontFamily: regularFont
                      ? "Epilogue, system-ui"
                      : "system-ui, sans-serif",
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
