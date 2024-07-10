import { JobResult, Routine } from "puppilot-routine-base";
import { Fetcher } from "../utils";

class Tieba extends Routine {
  static displayName = "贴吧签到";
  static id = "io.github.yuudi.puppilot-routines.tieba-sign";
  public async start(): Promise<JobResult> {
    const page = await this.getPage();
    await page.goto("https://tieba.baidu.com/robots.txt");
    const fetcher = new Fetcher(page);
    const userinfoRes = await fetcher.fetch(
      "https://tieba.baidu.com/f/user/json_userinfo",
    );
    const userinfo = await userinfoRes.text();
    if (!userinfo.includes("session_id")) {
      return {
        status: "failed",
        message: "需要登录",
      };
    }
    const mylikeRes = await fetcher.fetch(
      "http://tieba.baidu.com/f/like/mylike",
    );
    const mylike = await mylikeRes.text();
    const bas = mylike.match(/href="\/f\?kw=[^"]+" title="([^"]+)"/g);
    if (!bas) {
      return {
        status: "failed",
        message: "获取关注的贴吧失败",
      };
    }
    const tbsRes = await fetcher.fetch("http://tieba.baidu.com/dc/common/tbs");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const tbs: string = (await tbsRes.json())?.tbs;
    if (!tbs) {
      return {
        status: "failed",
        message: "获取tbs失败",
      };
    }

    for (const ba of bas) {
      const title = /href="\/f\?kw=[^"]+" title="([^"]+)"/.exec(ba);
      if (!title) {
        return {
          status: "failed",
          message: "获取贴吧标题失败",
        };
      }
      const payload = "ie=utf-8&kw=" + encodeURI(title[1]) + "&tbs=" + tbs;
      await fetcher.fetch("http://tieba.baidu.com/sign/add", {
        method: "POST",
        body: payload,
      });
    }

    return {
      status: "completed",
      message: "签到成功",
    };
  }
}

export default Tieba;
