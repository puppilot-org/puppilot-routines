// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routine } from "../types";

/**
 *
 * @returns {Routine}
 */
const miuiForum = () => ({
  displayName: "MIUI论坛签到",
  version: "0.1.0",
  id: "io.github.puppilot-org.puppilot-routines.miui-forum",

  start: async ({ getPage }) => {
    const page = await getPage();

    await page.goto("http://www.miui.com/extra.php?mod=sign/index&op=sign", {
      waitUntil: "domcontentloaded",
    });
    return {
      status: "completed",
      message: "签到成功",
    };
  },
});

export default miuiForum;
