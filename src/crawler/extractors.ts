import { CheerioAPI } from "cheerio";

export function extractProductData(url: string, $: CheerioAPI) {
const title =
$("h1").first().text().trim() ||
$("title").text().trim() ||
"Untitled";

const price =
$(".price").first().text().trim() ||
$('[class*="Price"]').first().text().trim() ||
"";

const category =
$(".breadcrumb li").last().text().trim() ||
$('[class*="category"]').first().text().trim() ||
"";

const description =
$("#product-description").text().trim() ||
$("meta[name='description']").attr("content") ||
"";

// Generic specs extraction
const specs: Record<string, string> = {};
$("table tr").each((_, row) => {
const key = $(row).find("th,td").first().text().trim();
const val = $(row).find("td").last().text().trim();
if (key && val) specs[key] = val;
});

return {
title,
url,
category,
price,
description,
specs,
};
}