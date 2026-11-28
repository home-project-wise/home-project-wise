"use strict";
// T1 coverage contract (docs/TOOL-LINK-CONTRACT.md): every article is classified, every tool is registered and real, every class A article links its tool.
// Static checks only: no browser, no network. A new article must get an entry in data/ARTICLE_TOOL_MAP.json or this test fails.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const registry = JSON.parse(read("website/tools-registry.json"));
const map = JSON.parse(read("data/ARTICLE_TOOL_MAP.json"));
let passed = 0;
function test(name, fn) { try { fn(); passed += 1; console.log("PASS " + name); } catch (e) { console.error("FAIL " + name + "\n  " + (e && e.message)); process.exitCode = 1; } }
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;|&rsquo;|&lsquo;|[\u2018\u2019]/g, "'")
  .replace(/&ldquo;|&rdquo;|[\u201c\u201d]/g, "\"").replace(/\s+/g, " ").trim();
const tools = new Map(registry.tools.map((t) => [t.id, t]));
const articleFiles = fs.readdirSync(path.join(ROOT, "website", "articles")).filter((f) => f.endsWith(".html")).map((f) => f.slice(0, -5)).sort();
const bySlug = new Map(map.articles.map((a) => [a.slug, a]));

test("registry: ids are unique, urls point at real pages and real anchors, titles and topics are present", () => {
  assert.equal(tools.size, registry.tools.length, "duplicate tool id");
  registry.tools.forEach((t) => {
    assert.match(t.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, t.id);
    assert.ok(t.title && t.title.length > 3, t.id + " title");
    assert.ok(Array.isArray(t.topics) && t.topics.length > 0, t.id + " topics");
    const [page, hash] = t.url.split("#");
    assert.match(page, /^[a-z0-9-]+\.html$/, t.id + " url");
    const html = read("website/" + page);
    assert.ok(new RegExp("<h1[^>]*>[^<]*" + t.title.split(": ")[0].replace(/[.*+?^${}()|[\]\\&]/g, "\\$&").replace(/\\&/g, "(?:&|&amp;)") ).test(html), t.id + ": title must start with the page h1");
    if (hash) assert.ok(html.includes("id=\"" + hash + "\""), t.id + ": anchor #" + hash + " missing");
    (t.params || []).forEach((p) => { assert.match(p.name, /^[a-z]{1,3}$/, t.id + " param name"); assert.ok(p.meaning, t.id + " param meaning"); });
    (t.linkPrefill || []).forEach((n) => assert.ok((t.params || []).some((p) => p.name === n), t.id + ": linkPrefill " + n + " is not an accepted parameter"));
  });
});

test("registry: no parameter that can carry a price, waste or allowance is allowed in an article link", () => {
  registry.tools.forEach((t) => (t.linkPrefill || []).forEach((n) => {
    const p = t.params.find((x) => x.name === n);
    assert.ok(!/price|cost|waste|allowance|budget/i.test(p.meaning), t.id + "." + n + " " + p.meaning);
  }));
});

test("site index: every standalone tool page in the registry is in the TOOLS list of scripts/rebuild_site_indexes.py (tools page, sitemap, search, hub)", () => {
  const listed = [...read("scripts/rebuild_site_indexes.py").matchAll(/\{"slug": "([a-z0-9-]+)", "hub":/g)].map((m) => m[1]).sort();
  const pages = [...new Set(registry.tools.map((t) => t.url.split("#")[0].replace(/\.html$/, "")))].sort();
  assert.deepEqual(listed, pages, "add the tool to TOOLS in scripts/rebuild_site_indexes.py (and to the registry), or remove the page");
});

test("coverage: every article file has exactly one map entry and every map entry has a file", () => {
  assert.deepEqual(map.articles.map((a) => a.slug).sort(), articleFiles, "add a class A, B or C entry to data/ARTICLE_TOOL_MAP.json for each new article");
  assert.equal(new Set(map.articles.map((a) => a.slug)).size, map.articles.length);
  map.articles.forEach((a) => assert.equal(a.path, "website/articles/" + a.slug + ".html"));
});

test("coverage: the decision sentence of every entry is in the article text", () => {
  map.articles.forEach((a) => assert.ok(text(read(a.path)).includes(text(a.decisionSentence)), a.slug + ": decisionSentence not found in the article"));
});

test("classes: A has a registered tool and a matching url; B has a planned tool and no url yet; C carries a reason", () => {
  map.articles.forEach((a) => {
    assert.ok(["A", "B", "C"].includes(a.class), a.slug);
    if (a.class === "A") { const t = tools.get(a.tool); assert.ok(t, a.slug + ": tool " + a.tool + " is not in the registry"); assert.equal(a.toolUrl, t.url, a.slug + ": toolUrl differs from the registry"); }
    if (a.class === "B") { assert.ok(a.tool && a.status && a.reason, a.slug + ": B needs tool, status and reason"); assert.equal(a.toolUrl, null, a.slug + ": B has no url until the tool exists"); assert.ok(!tools.has(a.tool) || a.status !== "planned", a.slug); }
    if (a.class === "C") { assert.ok(a.noToolReason && a.noToolReason.length >= 40, a.slug + ": C needs a reason of at least 40 characters"); assert.equal(a.toolUrl, null); }
  });
});

test("classes: the summary counts match the entries", () => {
  const c = { A: 0, B: 0, C: 0 }; map.articles.forEach((a) => { c[a.class] += 1; });
  assert.deepEqual(map.summary.classCounts, c);
  assert.equal(map.summary.articleCount, map.articles.length);
});

test("links: every class A article links the page of its tool, with only allowed query parameters", () => {
  map.articles.filter((a) => a.class === "A").forEach((a) => {
    const t = tools.get(a.tool), page = t.url.split("#")[0], html = read(a.path);
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).filter((h) => h.replace(/^(\.\.\/)+/, "").split(/[?#]/)[0] === page);
    assert.ok(hrefs.length > 0, a.slug + " does not link " + page);
    hrefs.forEach((h) => {
      const q = h.includes("?") ? h.split("?")[1].split("#")[0] : "";
      q.split("&").filter(Boolean).forEach((kv) => assert.ok((t.linkPrefill || []).includes(kv.split("=")[0]), a.slug + ": query parameter " + kv.split("=")[0] + " is not allowed in an article link"));
    });
  });
});

test("registry: the linked articles listed for each tool are the class A articles of that tool", () => {
  registry.tools.forEach((t) => assert.deepEqual((t.articles || []).slice().sort(), map.articles.filter((a) => a.class === "A" && a.tool === t.id).map((a) => a.slug).sort(), t.id));
  map.articles.filter((a) => a.class === "A").forEach((a) => assert.ok(tools.get(a.tool).articles.includes(a.slug)));
});

test("hooks: any element marked class tool-link in an article names a registered tool and links its page", () => {
  articleFiles.forEach((slug) => {
    const html = read("website/articles/" + slug + ".html");
    [...html.matchAll(/<(\w+)[^>]*class="[^"]*\btool-link\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/g)].forEach((m) => {
      const tag = m[0].slice(0, m[0].indexOf(">") + 1), id = (/data-tool="([^"]+)"/.exec(tag) || [])[1];
      assert.ok(id && tools.has(id), slug + ": tool-link without a registered data-tool");
      assert.ok(m[2].includes(tools.get(id).url.split("#")[0]), slug + ": tool-link does not link " + id);
    });
  });
});

console.log(passed + " tools-registry tests passed");

require("./test_decking_quantity.js");
require("./test_room_lighting_planner.js");
require("./test_motion_sensor_coverage.js");

require("./test_baseboard_skirting_trim.js");

require("./test_roof_covering_quantity.js");
require("./test_siding_cladding_quantity.js");
