import { JobResult, Routine } from "../types";

export default class extends Routine {
  static displayName = "网易云音乐签到";
  static id = "io.github.yuudi.puppilot-routines.163music";

  public async start(): Promise<JobResult> {
    const page = await this.getPage();
    await page.goto("https://music.163.com/api/point/dailyTask?type=0", {
      waitUntil: "domcontentloaded",
    });
    await page.goto("https://music.163.com/api/point/dailyTask?type=1", {
      waitUntil: "domcontentloaded",
    });
    return {
      status: "completed",
      message: "签到成功",
    };
  }
}
