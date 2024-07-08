import { Routine } from "../types";

export default class extends Routine {
  static displayName = "MIUI论坛签到";

  async start() {
    this.page = await this.getPage();
    await this.page.goto(
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
