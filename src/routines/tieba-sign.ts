import { JobResult, JobStatus, RoutineFunc } from "../types";

const tieba: RoutineFunc = () => ({
  displayName: "贴吧签到",
  id: "io.github.yuudi.puppilot-routines.tieba-sign",
  version: "0.1.0",
  async start({ getPage }): Promise<JobResult> {
    const page = await getPage();
    await page.goto("https://tieba.baidu.com/robots.txt", {
      waitUntil: "domcontentloaded",
    });

    return page.evaluate(async () => {
      const userinfoRes = await fetch(
        "https://tieba.baidu.com/f/user/json_userinfo",
        { credentials: "include" },
      );
      const userinfo = await userinfoRes.text();
      if (!userinfo.includes("session_id")) {
        return {
          status: JobStatus.Error,
          message: "需要登录",
        };
      }
      const mylikeRes = await fetch("http://tieba.baidu.com/f/like/mylike", {
        credentials: "include",
      });
      const mylike = await mylikeRes.text();
      const bas = mylike.match(/href="\/f\?kw=[^"]+" title="([^"]+)"/g);
      if (!bas) {
        return {
          status: JobStatus.Error,
          message: "获取关注的贴吧失败",
        };
      }
      const tbsRes = await fetch("http://tieba.baidu.com/dc/common/tbs", {
        credentials: "include",
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const tbs: string = (await tbsRes.json())?.tbs;
      if (!tbs) {
        return {
          status: JobStatus.Error,
          message: "获取tbs失败",
        };
      }

      for (const ba of bas) {
        const title = /href="\/f\?kw=[^"]+" title="([^"]+)"/.exec(ba);
        if (!title) {
          return {
            status: JobStatus.Error,
            message: "获取贴吧标题失败",
          };
        }
        const payload = "ie=utf-8&kw=" + encodeURI(title[1]) + "&tbs=" + tbs;
        await fetch("http://tieba.baidu.com/sign/add", {
          method: "POST",
          body: payload,
          credentials: "include",
        });
      }

      return {
        status: JobStatus.Success,
        message: "签到成功",
      };
    });
  },
});

export default tieba;
