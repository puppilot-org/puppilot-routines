import { JobResult, Routine } from "puppilot-routine-base";

class MyNewRoutine extends Routine {
  // metadatas
  static readonly displayName = "A New Routine";
  static readonly version = "0.1.0";
  // // optional metadatas
  // static readonly timeLimit = 2 * 60_000; // 2 minute
  // static readonly id = "io.github.<your-name>.<your-routine-id>"; // please follow java package naming convention
  // static readonly author = "Your Name";
  // static readonly reportEmail = "Your Email";
  // static readonly reportUrl = "https://github.com/puppilot-org/puppilot-routines/issues/new/choose"; // or any other way to report issues
  // static readonly description = `A new routine to do something, it helps you to do something, but it's not implemented yet`;

  public async start(): Promise<JobResult> {
    // initialize the page
    const page = await this.getPage();

    // // go to the website
    // await page.goto("https://github.com/");

    // // click the sign in button
    // await page.locator(".HeaderMenu-link--sign-in").click();

    // // return accordingly
    // return {
    //   status: "failed",
    //   message: "Not signed in",
    // };
    // return {
    //   status: "completed",
    //   message: "Starred the repository",
    // };

    await page.close();
    return {
      status: "skipped",
      message: "Not implemented yet",
    };
  }
}

export default MyNewRoutine;
