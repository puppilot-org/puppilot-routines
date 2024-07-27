// Not working. PC check-in is blocked

import { JobStatus, RoutineFunc } from "../types";
import { minute } from "../utils";

const quark: RoutineFunc = () => {
  return {
    displayName: "夸克网盘签到",
    version: "0.1.0",
    id: "io.github.puppilot-org.puppilot-routines.yuudi.quark",
    timeLimit: 10 * minute,

    start: async ({ getPage }) => {
      const page = await getPage();

      page.evaluate(() => {
        fetch(
          `https://drive-m.quark.cn/1/clouddrive/capacity/growth/sign?pr=ucpro&fr=pc`,
          {
            method: "POST",
            body: JSON.stringify({ sign_cyclic: true }),
            credentials: "include",
          },
        );
      });

      await page.close();
      return {
        status: JobStatus.Dismissed,
        message: "Not implemented yet",
      };
    },
  };
};

export default quark;
