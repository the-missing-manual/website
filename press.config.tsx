import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { flexsearchPlugin } from "fumapress/plugins/flexsearch";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { Mark } from "./src/components/mark";
import { docs } from "./.source/server";
import defaultMdxComponents from "fumadocs-ui/mdx";

export default defineConfig({
  content: docs.toFumadocsSource(),
  site: {
    name: "The Missing Manual",
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
  .plugins(flexsearchPlugin(), llmsPlugin(), takumiPlugin())
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
