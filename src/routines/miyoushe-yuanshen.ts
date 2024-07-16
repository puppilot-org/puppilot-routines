import { v4 as uuidv4 } from "uuid";
import { JobStatus, RoutineFunc } from "../types";

const Yuanshen: RoutineFunc = () => {
  return {
    displayName: "米游社原神每日签到",
    version: "0.1.0",
    id: "io.github.puppilot-org.puppilot-routines.yuudi.yuanshen",
    author: "yuudi",

    start: async ({ getPage, getStore }) => {
      const store = await getStore();
      let deviceId = await store.get<string>("deviceId");
      if (!deviceId) {
        deviceId = uuidv4();
        await store.set("deviceId", deviceId);
      }
      // initialize the page
      const page = await getPage();

      await page.goto("https://www.miyoushe.com/ys/", {
        waitUntil: "domcontentloaded",
      });

      return await page.evaluate(async (deviceId) => {
        const roleRes = await fetch(
          "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie",
          {
            headers: { "x-rpc-device_id": deviceId },
            credentials: "include",
          },
        );
        const roleData:
          | {
              data: {
                list: {
                  nickname: string;
                  game_uid: string;
                  region: string;
                  game_biz: string;
                }[];
              };
            }
          | { data: null; message: string } = await roleRes.json();
        if (roleData.data === null) {
          return {
            status: JobStatus.Error,
            message: roleData.message,
          };
        }
        const roles = roleData.data.list;
        const messages: string[] = [];
        for (const role of roles) {
          if (role.game_biz !== "hk4e_cn") {
            // skip non-genshin roles
            continue;
          }
          const region = role.region;
          const uid = role.game_uid;
          const signRes = await fetch(
            "https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign",
            {
              method: "POST",
              body: JSON.stringify({
                act_id: "e202009291139501",
                region: region,
                uid: uid,
              }),
              headers: { "x-rpc-device_id": deviceId },
              credentials: "include",
            },
          );
          const sign = await signRes.json();
          const signResultRes = await fetch(
            `https://api-takumi.mihoyo.com/event/bbs_sign_reward/info?act_id=e202009291139501&region=${region}&uid=${uid}`,
            {
              headers: { "x-rpc-device_id": deviceId },
              credentials: "include",
            },
          );
          const signResult = await signResultRes.json();
          const resultInfo =
            signResult.data?.total_sign_day ?? signResult?.message;
          const message =
            role.nickname + ": " + sign.message + " " + resultInfo;
          messages.push(message);
        }
        // await page.close();
        if (messages.length > 0) {
          return {
            status: JobStatus.Success,
            message: messages.join("\n"),
          };
        }
        return {
          status: JobStatus.Warning,
          message: "No roles found",
        };
      }, deviceId);
    },
  };
};

export default Yuanshen;
