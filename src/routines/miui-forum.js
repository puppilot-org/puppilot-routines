import { Routine } from "puppilot-routine-base";

export default class extends Routine {
  static displayName = "MIUI论坛签到";
  static id = "io.github.yuudi.puppilot-routines.miui-forum";
  static version = "0.1.0";

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
