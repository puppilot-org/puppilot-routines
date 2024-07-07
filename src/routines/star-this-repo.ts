import { JobResult, Page, Paged, Routine } from "../types";

const starred = 0 as const;
const unstarred = 1 as const;
const notSignedIn = 2 as const;

class StarThisRepo implements Routine, Paged {
  private page: Page;

  constructor() {}

  public initPage(page: Page) {
    this.page = page;
  }

  public async start(): Promise<JobResult> {
    await this.page.goto("https://github.com/yuudi/puppilot-routines");
    const starButton$ = this.page
      .waitForSelector(".unstarred.BtnGroup > form > button", {
        visible: true,
      })
      .then((button) => ({ button, status: unstarred }));
    const unstarButton$ = this.page
      .waitForSelector(".starred.BtnGroup > form > button", {
        visible: true,
      })
      .then((button) => ({ button, status: starred }));
    const signInButton$ = this.page
      .waitForSelector(".HeaderMenu-link--sign-in", {
        visible: true,
      })
      .then((button) => ({ button, status: notSignedIn }));
    const statusResult = await Promise.any([
      starButton$,
      unstarButton$,
      signInButton$,
    ]);
    if (statusResult.status === notSignedIn) {
      return {
        status: "failed",
        message: "Not signed in",
      };
    }
    if (statusResult.status === starred) {
      return {
        status: "skipped",
        message: "already starred",
      };
    }
    await statusResult.button.click();
    await this.page.waitForSelector(".starred.BtnGroup", {
      visible: true,
    });
    return {
      status: "completed",
      message: "Starred the repository",
    };
  }
}

export default StarThisRepo;
export const displayName = "Star the Puppilot repository on GitHub";
