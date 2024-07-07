export const displayName = "MIUI论坛签到";
export default class {
  initPage(page) {
    this.page = page;
  }

  async start() {
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
