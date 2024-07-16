import { JobStatus, RoutineFunc } from "../types";

const biliLive: RoutineFunc = () => ({
  displayName: "bilibili直播签到",
  version: "0.1.0",
  id: "io.github.yuudi.puppilot-routines.bilibili-live",

  start: async ({ getPage }) => {
    const page = await getPage();

    await page.goto("https://api.live.bilibili.com/sign/doSign", {
      waitUntil: "domcontentloaded",
    });
    return {
      status: JobStatus.Success,
      message: "签到成功",
    };
  },
});

export default biliLive;
