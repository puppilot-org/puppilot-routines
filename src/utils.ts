export const second = 1000;
export const minute = 60 * second;
export const hour = 60 * minute;
export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function xpath(xpath: string) {
  return `::-p-xpath(${xpath})`;
}
