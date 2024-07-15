import { resolve } from "path";
import * as puppeteer from "puppeteer-core";
import { RoutineFunc } from "../types";
import { getStore } from "./database-spy";
import { getOSOperations, importFile } from "./os";
import { systemExec } from "./utils";

async function buildSource() {
  const fileName = process.env.DEBUG_SCRIPT;
  if (!fileName) {
    throw new Error("Please provide the file name in .env file");
  }
  const filenameNoExt = fileName.split(".").slice(0, -1).join(".");
  const fullPath = resolve("src", "routines", fileName);
  const distPath = resolve("dist", "debug", filenameNoExt + ".js");
  await systemExec(
    `npx esbuild --bundle --target=node20 --format=esm --charset=utf8 --sourcemap --outfile="${distPath}" "${fullPath}"`,
  );
  return distPath;
}

export async function main() {
  const routineFile = await buildSource();
  const OSOperation = await getOSOperations();
  if (!(await OSOperation.checkOS("chrome"))) {
    console.log("Chrome is already running, please close it first");
  }
  const executablePath =
    process.env.CHROME_PATH || (await OSOperation.getBrowserPath("chrome"));
  const userDataDir =
    process.env.CHROME_USER_DATA_DIR ||
    (await OSOperation.getChromeProfilePath());
  if (!executablePath || !userDataDir) {
    throw new Error(
      "Chrome path or user data directory not found, please provide it in .env file",
    );
  }
  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    defaultViewport: null,
    userDataDir,
    args: ["--profile-directory=Default"],
  });

  const routineMod: { default: RoutineFunc } = (await importFile(
    routineFile,
  )) as { default: RoutineFunc };
  const routine = routineMod.default();
  const result = await routine.start(
    {
      getPage() {
        return browser.newPage();
      },
      getStore() {
        return getStore(routine.id);
      },
    },
    {
      puppeteer,
    },
  );
  console.log("Routine result:", result);
}
