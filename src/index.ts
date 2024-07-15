import { configDotenv } from "dotenv";
import { main } from "./dev/debug";

configDotenv();
await main();
