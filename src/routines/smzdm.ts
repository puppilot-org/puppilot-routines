import { JobStatus, RoutineFunc } from "../types";

const smzdm: RoutineFunc = () => {
  return {
    displayName: "什么值得买",
    version: "0.1.0",
    id: "io.github.puppilot-org.puppilot-routines.yuudi.smzdm",
    altNames: ["smzdm"],

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    start: async ({ getPage }) => {
      const page = await getPage();

      await page.goto("https://www.smzdm.com/");

      const data = await page.evaluate(async () => {
        const res = await fetch(
          "https://zhiyou.smzdm.com/user/checkin/jsonp_checkin",
          { credentials: "include" },
        );
        return await res.json();
      });
      if (data.error_code !== 0) {
        return {
          status: JobStatus.Error,
          message: data.error_msg,
        };
      }
      return {
        status: JobStatus.Success,
        message: "success",
      };
    },
  };
};

export default smzdm;
