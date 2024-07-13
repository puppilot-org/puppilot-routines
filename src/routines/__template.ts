import { JobResult, Routine } from "puppilot-routine-base";

class StarThisRepo extends Routine {
  // metadatas
  static displayName = "A New Routine";
  static readonly version = "v0.1.0";
  // // optional metadatas
  // static timeLimit = 2 * 60_000; // 2 minute
  // static id = "io.github.<your-name>.<your-routine-id>"; // please follow java package naming convention
  // static author = "Your Name";
  // static reportEmail = "Your Email";
  // static reportUrl = "https://github.com/yuudi/puppilot-routines/issues/new/choose"; // or any other way to report issues
  // static description = `A new routine to do something, it helps you to do something, but it's not implemented yet`;

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

export default StarThisRepo;
