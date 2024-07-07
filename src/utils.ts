import { Page } from "puppeteer-core";

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function xpath(xpath: string) {
  return `::-p-xpath(${xpath})`;
}

export class Fetcher {
  constructor(public readonly page: Page) {
    page.setBypassCSP(true);
  }

  public async fetch(
    input: string | URL | globalThis.Request,
    init?: RequestInit,
  ) {
    return this.page.evaluate(
      (input, init) => window.fetch(input, init),
      input,
      {
        credentials: "include" as const,
        ...init,
      },
    );
  }
}
