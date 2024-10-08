import { JobStatus, Routine } from "../types";

export default function (): Routine {
  return {
    // metadatas
    displayName: "A New Routine",
    version: "0.1.0",
    id: "io.github.puppilot-org.puppilot-routines.<your-name>.<your-routine-id>", // please follow java package naming convention

    // // optional metadatas
    // timeLimit: 2 * 60_000, // 2 minute
    // author: "Your Name",
    // reportEmail: "Your Email",
    // reportUrl:
    //   "https://github.com/puppilot-org/puppilot-routines/issues/new/choose", // or any other way to report issues
    // description: `A new routine to do something, it helps you to do something, but it's not implemented yet`,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async start({ getPage, getStore }, { puppeteer }) {
      // initialize the page
      const page = await getPage();

      // // go to the website
      // await page.goto("http://127.0.0.1/");

      // // click the check in button
      // await page.locator("button.check-in").click();

      // // return accordingly
      // return {
      //   status: JobStatus.Error,
      //   message: "Not signed in",
      // };
      // return {
      //   status: JobStatus.Success,
      //   message: "Check in successfully",
      // };

      await page.close();
      return {
        status: JobStatus.Dismissed,
        message: "Not implemented yet",
      };
    },
  };
}
