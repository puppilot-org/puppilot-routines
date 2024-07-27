import { resolve } from "path";
(async function () {
  const filename = resolve(process.argv[2]);
  const mod = await import(`file://localhost${filename}`);
  const { id, version, displayName, author, description, altNames } =
    mod.default();
  console.log(
    JSON.stringify({ id, version, displayName, author, description, altNames }),
  );
})();
