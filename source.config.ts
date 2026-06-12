import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export const docs = defineDocs({
    dir: "content",
    docs: {
        async: true,
        schema: pageSchema,
        postprocess: {
            includeProcessedMarkdown: true,
        },
    },
    meta: {
        schema: metaSchema,
    },
});

export default defineConfig({
    mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: (v) => [rehypeKatex, ...v],
    },
});
