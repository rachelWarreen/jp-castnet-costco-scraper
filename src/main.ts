import { runCrawler } from "./crawler/cheerioCrawler";
import { logger } from "./utils/logger";
import fs from "fs";
import path from "path";

async function bootstrap() {
try {
const inputPath = path.join(__dirname, "..", "data", "sample-input.json");
const inputData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

if (!Array.isArray(inputData.startUrls)) {
throw new Error("Invalid input: startUrls must be an array.");
}

const results = await runCrawler(inputData.startUrls, inputData.maxPages || 20);

const outputPath = path.join(__dirname, "..", "data", "sample-output.json");
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

logger.info(`Crawl complete. Output saved to ${outputPath}`);
} catch (err: any) {
logger.error("Fatal error in main:", err.message);
}
}

bootstrap();