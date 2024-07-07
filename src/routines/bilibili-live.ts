import { JobResult, Page, Paged, Routine } from "../types";

class BiliLive implements Routine, Paged {
  private page: Page;

  public initPage(page: Page) {
    this.page = page;
  }

  public async start(): Promise<JobResult> {
    await this.page.goto("https://api.live.bilibili.com/sign/doSign", {
      waitUntil: "domcontentloaded",
    });
    return {
      status: "completed",
      message: "签到成功",
    };
  }
}
export default BiliLive;
export const displayName = "bilibili直播签到";
