import { JobResult, Routine } from "../types";
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
    const tbsRes = await fetcher.fetch("http://tieba.baidu.com/dc/common/tbs");
    const { tbs } = await tbsRes.json();

    for (const ba of bas) {
      const title = /href="\/f\?kw=[^"]+" title="([^"]+)"/.exec(ba);
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
