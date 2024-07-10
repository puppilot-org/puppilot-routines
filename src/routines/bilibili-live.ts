import { JobResult, Routine } from "puppilot-routine-base";

class BiliLive extends Routine {
  static displayName = "bilibili直播签到";
  static id = "io.github.yuudi.puppilot-routines.bilibili-live";

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
