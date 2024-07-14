import { Page } from "puppeteer-core";
import { JobResult, Routine, Store } from "puppilot-routine-base";

class StarThisRepo extends Routine {
  static displayName = "Star the Puppilot repository on GitHub";
  static id = "dev.yuudi.puppilot-routines.star-this-repo";
  static author = "yuudi";
  static version = "1.0.0";
  static description =
    '(example routine) Star the "puppilot" repository on GitHub';

  public async start(): Promise<JobResult> {
    // before opening page, check if the we already starred the repository
    const store = await this.getStore();
    const starred = await store.get<boolean>("starred");
    if (starred) {
      return {
        status: "skipped",
        message: "Already starred the repository",
      };
    }

    // create a new page
    const page = await this.getPage();

    await page.goto("https://github.com/puppilot-org/puppilot");

    // three possible statuses: starred, unstarred, notSignedIn
    // we use three promises to wait for the three possible statuses
    return Promise.any([
      this.processNotSignedIn(page),
      this.processAlreadyStarred(page),
      this.processUnstarred(page, store),
    ]);
  }

  private async processNotSignedIn(page: Page) {
    await page.waitForSelector(".HeaderMenu-link--sign-in", {
      visible: true,
    });
    return {
      status: "failed",
      message: "Not signed in",
    } as const;
  }

  private async processAlreadyStarred(page: Page) {
    await page.waitForSelector(".starred.BtnGroup", {
      visible: true,
    });
    return {
      status: "skipped",
      message: "Already starred the repository",
    } as const;
  }

  private async processUnstarred(page: Page, store: Store) {
    const starButton = await page.waitForSelector(
      ".unstarred.BtnGroup > form > button",
      {
        visible: true,
      },
    );
    // click the star button
    await starButton?.click();
    // wait for the star button to change to already starred
    await page.waitForSelector(".starred.BtnGroup", {
      visible: true,
    });
    // set the starred status in the store
    await store.set("starred", true);
    // 🎉
    return {
      status: "completed",
      message: "Starred the repository",
    } as const;
  }
}

export default StarThisRepo;
