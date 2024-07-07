import { Page } from "puppeteer-core";

type JobStatus = "completed" | "failed" | "skipped";
type CheckStatus = JobStatus | "continue";

export type JobResult = {
  status: JobStatus;
  message: string;
};

export type CheckResult = {
  status: CheckStatus;
  message: string;
};

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];

export interface Store {
  get<T extends JSONValue>(key: string): Promise<T>;
  set(key: string, value: JSONValue): Promise<void>;
}

export interface Routine {
  start(): Promise<JobResult>;
}

export interface Paged {
  initPage(page: Page): void | Promise<void>;
}

export interface Stored {
  initStore(store: Store): void | Promise<void>;
}

export interface Checked {
  check(): Promise<CheckResult> | CheckResult;
}

export { Page };
