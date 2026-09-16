import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { rewriteMarkdownLinks } from "./utils.js";

test("rewrites notion page URLs to repository relative markdown paths", () => {
  const currentFile = "/repo/docs/01_FarmOS.md";
  const notionFiles = new Map([
    ["9c5627f1-ae1d-83e3-b7e3-01f3fd4366a3", "/repo/docs/01_FarmOS.md"],
    ["a35627f1-ae1d-82d6-8a71-816aa0f9ba36", "/repo/docs/01_FarmOS/02_Start-Here.md"],
  ]);

  const markdown = [
    "[01_FarmOS](https://app.notion.com/p/9c5627f1ae1d83e3b7e301f3fd4366a3)",
    "[02_Start Here](https://app.notion.com/p/a35627f1ae1d82d68a71816aa0f9ba36)",
    "[Unrelated](https://example.com/keep-me)",
  ].join("\n\n");

  const rewritten = rewriteMarkdownLinks(markdown, notionFiles, currentFile);

  assert.equal(
    rewritten,
    [
      "[01_FarmOS](./01_FarmOS.md)",
      "[02_Start Here](./01_FarmOS/02_Start-Here.md)",
      "[Unrelated](https://example.com/keep-me)",
    ].join("\n\n"),
  );
});

test("preserves query strings and anchors when rewriting notion links", () => {
  const currentFile = "/repo/docs/01_FarmOS/04_Glossary.md";
  const notionFiles = new Map([
    ["9c5627f1-ae1d-83e3-b7e3-01f3fd4366a3", "/repo/docs/01_FarmOS/01_FarmOS.md"],
    ["190627f1-ae1d-83e2-9fc3-8120f3dacc78", "/repo/docs/01_FarmOS/06_Farm-Specification.md"],
  ]);

  const markdown = [
    "[01_FarmOS](https://www.notion.so/01_FarmOS-9c5627f1ae1d83e3b7e301f3fd4366a3#related-pages)",
    "[06_Farm Specification](https://app.notion.com/p/190627f1ae1d83e29fc38120f3dacc78?source=copy-link)",
  ].join("\n\n");

  const rewritten = rewriteMarkdownLinks(markdown, notionFiles, currentFile);

  assert.equal(
    rewritten,
    [
      "[01_FarmOS](./01_FarmOS.md#related-pages)",
      "[06_Farm Specification](./06_Farm-Specification.md?source=copy-link)",
    ].join("\n\n"),
  );
});
