import { JobStatus, Routine } from "../types";

export default function (): Routine {
  return {
    // metadatas
    displayName: "阿里云盘",
    version: "0.1.0",
    id: "io.github.puppilot-org.puppilot-routines.yuudi.aliyundrive",
    altNames: ["aliyundrive", "alipan"],

    start: async ({ getPage, getStore }) => {
      const store = await getStore();
      let old_refresh_token = await store.get<string>("refresh_token");

      if (!old_refresh_token) {
        const page = await getPage();
        await page.goto("https://aliyundrive.com", {
          waitUntil: "domcontentloaded",
        });
        const token: string | undefined = await page.evaluate(
          () => localStorage.token,
        );
        if (!token) {
          return {
            status: JobStatus.Error,
            message: "Not Signed In",
          };
        }
        old_refresh_token = JSON.parse(token).refresh_token;
        page.close();
      }

      const tokenRes = await fetch(
        "https://auth.aliyundrive.com/v2/account/token",
        {
          method: "POST",
          body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: old_refresh_token,
          }),
          headers: {
            "content-type": "application/json",
          },
        },
      );
      const token = await tokenRes.json();
      const { access_token, refresh_token } = token;
      await store.set("refresh_token", refresh_token);

      const signRes = await fetch(
        "https://member.aliyundrive.com/v1/activity/sign_in_list",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        },
      );

      const sign = await signRes.json();
      const signInLogs = sign.result.signInLogs;
      const reward = signInLogs[signInLogs.length - 1].reward;

      return {
        status: JobStatus.Success,
        message: reward.name + reward.description,
      };
    },
  };
}
