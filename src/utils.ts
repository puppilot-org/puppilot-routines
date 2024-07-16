export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function xpath(xpath: string) {
  return `::-p-xpath(${xpath})`;
}
