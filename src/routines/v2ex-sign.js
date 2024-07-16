// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JobStatus, Routine } from "../types";

/**
 *
 * @returns {Routine}
 */
const v2exSign = () => ({
  displayName: "V2ex铜币领取",
  id: "io.github.yuudi.puppilot-routines.v2ex-sign",
  version: "1.0.0",

  start: async ({ getPage }, { puppeteer }) => {
    const page = await getPage();
    await page.goto("https://v2ex.com/mission/daily");

    const signedIn = page.locator('a[href="/settings"]').map(() => true);
    const notSignedIn = page.locator('a[href="/signin"]').map(() => false);

    const loginStatus = await puppeteer.Locator.race([
      signedIn,
      notSignedIn,
    ]).wait();
    if (!loginStatus) {
      return {
        status: JobStatus.Error,
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
        status: JobStatus.Success,
        message: "领取成功",
      };
    } else {
      return {
        status: JobStatus.Dismissed,
        message: "已领取",
      };
    }
  },
});

export default v2exSign;
