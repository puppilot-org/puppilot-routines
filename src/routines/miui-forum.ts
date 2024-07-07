import { JobResult, Page, Paged, Routine } from "../types";

export const displayName = "MIUI论坛签到";
export default class implements Routine, Paged {
  #page: Page;

  constructor() {}

  public initPage(page: Page) {
    this.#page = page;
  }

  public async start(): Promise<JobResult> {
    await this.#page.goto(
      "http://www.miui.com/extra.php?mod=sign/index&op=sign",
      {
        waitUntil: "domcontentloaded",
      },
    );
    return {
      status: "completed",
      message: "签到成功",
    };
  }
}
