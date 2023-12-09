import puppeteer from "puppeteer";
import {Retryable} from "typescript-retry-decorator";

export class Retry {

    @Retryable({maxAttempts: 5, value: [Error], backOff: 3})
    static async getPageContent(url: string, timeout = 60000) {
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();

        try {
            await page.goto(url, {timeout});
            const content = await page.content()
            if (content.includes("server error")) {
                throw new Error("Received server error")
            }
            return content;
            // return page.content();
            // } catch (error) {
            //     throw new Error(`Failed to get page content from ${url}: ${error}`);
        } finally {
            await browser.close();
        }
    }
}