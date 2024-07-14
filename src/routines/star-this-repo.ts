import { JobResult, Routine } from "puppilot-routine-base";

const enum StarStatus {
  Starred,
  Unstarred,
  NotSignedIn,
}

class StarThisRepo extends Routine {
  static displayName = "Star the Puppilot repository on GitHub";
  static id = "dev.yuudi.puppilot-routines.star-this-repo";
  static author = "yuudi";
  static version = "1.0.0";
  static description =
    '(example routine) Star the "puppilot" repository on GitHub';

  public async start(): Promise<JobResult> {
    // before starting the routine, check if the we already starred the repository
    const store = await this.getStore();
    const starred = await store.get<boolean>("starred");
    if (starred) {
      return {
        status: "skipped",
        message: "Already starred the repository",
      };
    }

    // start the routine
    // create a new page
    const page = await this.getPage();

    await page.goto("https://github.com/puppilot-org/puppilot");
    // three possible statuses: starred, unstarred, notSignedIn
    // we use three promises to wait for the three possible statuses
    const starButton$ = page
      .waitForSelector(".unstarred.BtnGroup > form > button", {
        visible: true,
      })
      .then((button) => ({ button, status: StarStatus.Unstarred as const }));
    const unstarButton$ = page
      .waitForSelector(".starred.BtnGroup > form > button", {
        visible: true,
      })
      .then((button) => ({ button, status: StarStatus.Starred as const }));
    const signInButton$ = page
      .waitForSelector(".HeaderMenu-link--sign-in", {
        visible: true,
      })
      .then((button) => ({ button, status: StarStatus.NotSignedIn as const }));
    // wait for any of the three promises to resolve
    const statusResult = await Promise.any([
      starButton$,
      unstarButton$,
      signInButton$,
    ]);
    // handle the resolved promise
    if (statusResult.status === StarStatus.NotSignedIn) {
      return {
        status: "failed",
        message: "Not signed in",
      };
    }
    if (statusResult.status === StarStatus.Starred) {
      return {
        status: "skipped",
        message: "already starred",
      };
    }
    // click the star button
    await statusResult.button?.click();
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
    };
  }
}

export default StarThisRepo;
