import { Page } from "puppeteer-core";

type JobStatus = "completed" | "failed" | "skipped";

export type JobResult = {
  status: JobStatus;
  message: string;
};

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];

export interface Store {
  get<T extends JSONValue>(key: string): Promise<T>;
  set(key: string, value: JSONValue): Promise<void>;
}

export abstract class Routine {
  public static readonly displayName: string =
    "Please override displayName in your routine";
  public static readonly author?: string;
  public static readonly reportEmail?: string;
  public static readonly reportUrl?: string;
  public static readonly description?: string;

  constructor(
    protected getPage: () => Promise<Page>,
    protected getStore: () => Promise<Store>,
  ) {}
  public abstract start(): Promise<JobResult>;
}
