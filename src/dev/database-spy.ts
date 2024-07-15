import { promises as fs } from "fs";
import { resolve } from "path";
import { JSONValue, Store } from "../types";

export async function getStore(store: string): Promise<Store> {
  const subPath = resolve("dist", "debug", "db", store);
  await fs.mkdir(subPath, { recursive: true });
  return {
    async get<T extends JSONValue>(key: string) {
      const fullPath = resolve(subPath, key);
      const value = await fs.readFile(fullPath, "utf-8").catch(() => undefined);
      return value === undefined ? undefined : (JSON.parse(value) as T);
    },
    async set(key: string, value: JSONValue) {
      const fullPath = resolve(subPath, key);
      await fs.writeFile(fullPath, JSON.stringify(value));
    },
  };
}
