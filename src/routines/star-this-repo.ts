import { Page } from "puppeteer-core";
import { RoutineFunc, Store } from "../types";

const starThisRepo: RoutineFunc = () => {
  return {
    displayName: "Star the Puppilot repository on GitHub",
    id: "dev.yuudi.puppilot-routines.star-this-repo",
    author: "yuudi",
    version: "1.0.0",
    description: '(example routine) Star the "puppilot" repository on GitHub',

    async start({ getPage, getStore }) {
      // before opening page, check if the we already starred the repository
      const store = await getStore();
      const starred = await store.get<boolean>("starred");
      if (starred) {
        return {
          status: "skipped",
          message: "Already starred the repository",
        };
      }
      // create a new page
      const page = await getPage();

      await page.goto("https://github.com/puppilot-org/puppilot");

      // three possible statuses: starred, unstarred, notSignedIn
      // we use three promises to wait for the three possible statuses
      return Promise.any([
        processNotSignedIn(page),
        processAlreadyStarred(page),
        processUnstarred(page, store),
      ]);
      // }
    },
  };
};

const processNotSignedIn = async (page: Page) => {
  await page.waitForSelector(".HeaderMenu-link--sign-in", {
    visible: true,
  });
  return {
    status: "failed",
    message: "Not signed in",
  } as const;
};

const processAlreadyStarred = async (page: Page) => {
  await page.waitForSelector(".starred.BtnGroup", {
    visible: true,
  });
  return {
    status: "skipped",
    message: "Already starred the repository",
  } as const;
};

const processUnstarred = async (page: Page, store: Store) => {
  const starButton = await page.waitForSelector(
    ".unstarred.BtnGroup > form > button",
    {
      visible: true,
    },
  );
  // click the star button
  await starButton?.click();
  // wait for the star button to change to already starred
  await page.waitForSelector(".starred.BtnGroup", {
    visible: true,
  });
  // set the starred status in the store
  await store.set("starred", true);
  // 🎉
  return {
    status: "completed",
    message: "Starred the repository",
  } as const;
};

export default starThisRepo;
