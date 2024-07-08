import { JobResult, Routine } from "../types";

const starred = 0 as const;
const unstarred = 1 as const;
const notSignedIn = 2 as const;

class StarThisRepo extends Routine {
  static displayName = "Star the Puppilot repository on GitHub";
  static id = "dev.yuudi.puppilot-routines.star-this-repo";

  public async start(): Promise<JobResult> {
    const page = await this.getPage();

    await page.goto("https://github.com/yuudi/puppilot-routines");
    // three possible statuses: starred, unstarred, notSignedIn
    const starButton$ = page
      .waitForSelector(".unstarred.BtnGroup > form > button", {
        visible: true,
      })
      .then((button) => ({ button, status: unstarred }));
    const unstarButton$ = page
      .waitForSelector(".starred.BtnGroup > form > button", {
        visible: true,
      })
      .then((button) => ({ button, status: starred }));
    const signInButton$ = page
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
    await page.waitForSelector(".starred.BtnGroup", {
      visible: true,
    });
    return {
      status: "completed",
      message: "Starred the repository",
    };
  }
}

export default StarThisRepo;
