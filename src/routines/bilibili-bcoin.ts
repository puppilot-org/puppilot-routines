import { JobStatus, RoutineFunc } from "../types";
import { xpath } from "../utils";

const bcoin: RoutineFunc = () => ({
  displayName: "B站年费大会员每月领取B币",
  id: "io.github.yuudi.puppilot-routines.bilibili-bcoin",
  version: "1.0.0",
  description:
    "领取B站年费大会员每月赠送的B币，并记录下次领取时间，在这个时间前运行则跳过任务",
  async start({ getPage, getStore }, { puppeteer }) {
    const store = await getStore();
    const nextAvailableTime = await store.get<number>("nextAvailable");
    if (nextAvailableTime && nextAvailableTime > Date.now()) {
      return {
        status: JobStatus.Dismissed,
        message:
          "B币已领取过，下次领取时间：" +
          new Date(nextAvailableTime).toLocaleString(),
      };
    }
    const page = await getPage();
    await page.goto("https://account.bilibili.com/account/big/myPackage");
    const signedIn = page.locator("div.user-con.signin").map(() => true);
    const notSignedIn = page.locator(".login__main").map(() => false);
    const loginStatus = await puppeteer.Locator.race([
      signedIn,
      notSignedIn,
    ]).wait();
    if (!loginStatus) {
      return {
        status: JobStatus.Error,
        message: "Not signed in",
      };
    }
    const button = await page
      .locator(".bcoin-wrapper .coupon-btn")
      .waitHandle();
    const nextAvailable = page
      .locator(
        xpath(
          '//div[@class="bcoin-wrapper"]//div[@class="coupon-content-con"]/div[@class="coupon-desc-tip"][3]',
        ),
      )
      .map((el) => el.textContent);
    const buttonDisabled = await button.evaluate((node) =>
      node.classList.contains("coupon-btn-disabled"),
    );

    let couponGot = false;
    if (!buttonDisabled) {
      await button.click();
      // Wait for the button to be disabled
      await page
        .locator(".bcoin-wrapper .coupon-btn.coupon-btn-disabled")
        .wait();
      couponGot = true;
    }

    const nextAvailableText = (await nextAvailable.wait()) ?? "";
    const nextAvailableDateText = /\d{4}\/\d{2}\/\d{2}/.exec(nextAvailableText);
    if (!nextAvailableDateText) {
      return {
        status: JobStatus.Error,
        message: "Failed to get next available date",
      };
    }
    const nextAvailableDate = new Date(nextAvailableDateText[0]);
    await store.set("nextAvailable", nextAvailableDate.getTime());

    return couponGot
      ? {
          status: JobStatus.Success,
          message: "B币领取成功",
        }
      : {
          status: JobStatus.Dismissed,
          message: "B币已领取过，下次领取时间：" + nextAvailableDateText[0],
        };
  },
});

export default bcoin;
