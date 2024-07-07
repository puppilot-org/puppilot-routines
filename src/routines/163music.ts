import { JobResult, Page, Paged, Routine } from "../types";

export const displayName = "网易云音乐签到";
export default class implements Routine, Paged {
  #page: Page;

  constructor() {}

  public initPage(page: Page) {
    this.#page = page;
  }

  public async start(): Promise<JobResult> {
    await this.#page.goto("https://music.163.com/api/point/dailyTask?type=0", {
      waitUntil: "domcontentloaded",
    });
    await this.#page.goto("https://music.163.com/api/point/dailyTask?type=1", {
      waitUntil: "domcontentloaded",
    });
    return {
      status: "completed",
      message: "签到成功",
    };
  }
}
