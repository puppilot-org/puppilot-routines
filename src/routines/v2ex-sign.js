import { Locator } from "puppeteer-core";
import { Routine } from "puppilot-routine-base";

class V2exSign extends Routine {
  static displayName = "V2ex铜币领取";
  static id = "io.github.yuudi.puppilot-routines.v2ex-sign";
  static version = "v1.0.0";

  async start() {
    const page = await this.getPage();
    await page.goto("https://v2ex.com/mission/daily");

    const signedIn = page.locator('a[href="/settings"]').map(() => true);
    const notSignedIn = page.locator('a[href="/signin"]').map(() => false);

    const loginStatus = await Locator.race([signedIn, notSignedIn]).wait();
    if (!loginStatus) {
      return {
        status: "failed",
        message: "未登录",
      };
    }

    const available$ = page
      .locator('#Main input[value="领取 X 铜币"]')
      .click()
      .then(() => true);
    const unavailable$ = page
      .locator('#Main input[value="查看我的账户余额"]')
      .wait()
      .then(() => false);
    const result = await Promise.any([available$, unavailable$]);
    if (result) {
      return {
        status: "completed",
        message: "领取成功",
      };
    } else {
      return {
        status: "skipped",
        message: "已领取",
      };
    }
  }
}

export default V2exSign;
