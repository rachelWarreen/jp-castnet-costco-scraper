import axios from "axios";
import * as cheerio from "cheerio";
import { extractProductData } from "./extractors";
import { logger } from "../utils/logger";

export async function runCrawler(startUrls: string[], maxPages: number) {
const visited = new Set<string>();
const results: any[] = [];
const queue: string[] = [...startUrls];

while (queue.length > 0 && results.length < maxPages) {
const url = queue.shift()!;
if (visited.has(url)) continue;
visited.add(url);

try {
logger.info(`Fetching: ${url}`);
const response = await axios.get(url, { timeout: 15000 });
const $ = cheerio.load(response.data);

const productData = extractProductData(url, $);
results.push(productData);

// Extract additional links (internal)
$("a[href]").each((_, el) => {
const href = $(el).attr("href");
if (!href) return;
if (href.startsWith("http") && href.includes("costco.co.jp")) {
if (!visited.has(href)) queue.push(href);
}
});
} catch (err: any) {
logger.error(`Failed to process ${url}: ${err.message}`);
}
}

return results;
}