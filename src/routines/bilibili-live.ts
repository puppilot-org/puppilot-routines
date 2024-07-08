import { JobResult, Routine } from "../types";

class BiliLive extends Routine {
  static displayName = "bilibili直播签到";

  public async start(): Promise<JobResult> {
    const page = await this.getPage();
    await page.goto("https://api.live.bilibili.com/sign/doSign", {
      waitUntil: "domcontentloaded",
    });
    return {
      status: "completed",
      message: "签到成功",
    };
  }
}
export default BiliLive;
