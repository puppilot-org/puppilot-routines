import {
  Checked,
  CheckResult,
  JobResult,
  Page,
  Paged,
  Routine,
  Store,
  Stored,
} from "../types";
import { xpath } from "../utils";

class BCoin implements Routine, Paged, Stored, Checked {
  private store: Store;
  private page: Page;

  public initStore(store: Store) {
    this.store = store;
  }

  public async check(): Promise<CheckResult> {
    const nextAvailable = await this.store.get<number>("nextAvailable");
    if (nextAvailable && nextAvailable > Date.now()) {
      return {
        status: "skipped",
        message:
          "B币已领取过，下次领取时间：" +
          new Date(nextAvailable).toLocaleString(),
      };
    }
    return {
      status: "continue",
      message: "继续",
    };
  }

  public async initPage(page: Page) {
    this.page = page;
  }

  public async start(): Promise<JobResult> {
    await this.page.goto("https://account.bilibili.com/account/big/myPackage");
    const signedIn = this.page.locator("div.user-con.signin").map(() => true);
    const notSignedIn = this.page.locator(".login__main").map(() => false);
    const loginStatus = await this.page.locator.prototype
      .race([signedIn, notSignedIn])
      .wait();
    if (!loginStatus) {
      return {
        status: "failed",
        message: "Not signed in",
      };
    }
    const button = await this.page
      .locator(".bcoin-wrapper .coupon-btn")
      .waitHandle();
    const nextAvailable = this.page
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
      await this.page
        .locator(".bcoin-wrapper .coupon-btn.coupon-btn-disabled")
        .wait();
      couponGot = true;
    }

    const nextAvailableText = await nextAvailable.wait();
    const nextAvailableDateText = /\d{4}\/\d{2}\/\d{2}/.exec(nextAvailableText);
    if (!nextAvailableDateText) {
      return {
        status: "failed",
        message: "Failed to get next available date",
      };
    }
    const nextAvailableDate = new Date(nextAvailableDateText[0]);
    await this.store.set("nextAvailable", nextAvailableDate.getTime());

    return couponGot
      ? {
          status: "completed",
          message: "B币领取成功",
        }
      : {
          status: "skipped",
          message: "B币已领取过，下次领取时间：" + nextAvailableDateText[0],
        };
  }
}

export default BCoin;
export const displayName = "B站年费大会员每月领取B币";
