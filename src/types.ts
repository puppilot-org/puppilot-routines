import { Page } from "puppeteer-core";

type JobStatus = "completed" | "failed" | "skipped" | "error";

export interface JobResult {
  status: JobStatus;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/consistent-type-definitions
type JSONObject = {
  [key: string]: JSONValue;
};
type JSONArray = JSONValue[];
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;

export interface Store {
  get<T extends JSONValue>(key: string): Promise<T>;
  set(key: string, value: JSONValue): Promise<void>;
}

export abstract class Routine {
  public static get displayName(): string {
    throw new Error("Please override displayName in your own routine");
  }
  public static readonly author?: string;
  public static readonly reportEmail?: string;
  public static readonly reportUrl?: string;
  public static readonly description?: string;
  public static readonly timeLimit: number = 120_000; // 2 minutes
  public static get id(): string {
    return btoa(this.displayName);
  }

  constructor(
    protected getPage: () => Promise<Page> | Page,
    protected getStore: () => Promise<Store> | Store,
  ) {}
  public abstract start(): Promise<JobResult>;
}
