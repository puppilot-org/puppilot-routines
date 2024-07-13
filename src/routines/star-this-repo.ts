import { JobResult, Routine } from "puppilot-routine-base";

const starred = 0;
const unstarred = 1;
const notSignedIn = 2;

class StarThisRepo extends Routine {
  static displayName = "Star the Puppilot repository on GitHub";
  static id = "dev.yuudi.puppilot-routines.star-this-repo";
  static readonly version = "v1.0.0";
  static description =
    '(example routine) Star the "puppilot" repository on GitHub';

  public async start(): Promise<JobResult> {
    const page = await this.getPage();

    await page.goto("https://github.com/puppilot-org/puppilot");
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
    await statusResult.button?.click();
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
