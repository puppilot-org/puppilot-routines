import { RoutineFunc } from "../types";

const neteaseMusic: RoutineFunc = () => {
  return {
    displayName: "网易云音乐签到",
    version: "0.1.0",
    id: "io.github.puppilot-org.puppilot-routines.163music",

    start: async ({ getPage }) => {
      const page = await getPage();

      await page.goto("https://music.163.com/api/point/dailyTask?type=0", {
        waitUntil: "domcontentloaded",
      });
      await page.goto("https://music.163.com/api/point/dailyTask?type=1", {
        waitUntil: "domcontentloaded",
      });
      return {
        status: "completed",
        message: "签到成功",
      };
    },
  };
};

export default neteaseMusic;
