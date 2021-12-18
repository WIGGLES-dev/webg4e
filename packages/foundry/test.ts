import * as dotenv from "dotenv";
import { exec } from "child_process";
import * as path from "path";

const config = dotenv.config();
const foundryApp = path.normalize(process.env.FOUNDRY_APP);
const foundryUser = path.normalize(process.env.FOUNDRY_USER);
const chromePath = path.normalize(process.env.CHROME_EXE);

const openChromeTo = (url: string) => {
  exec(`${chromePath} --app=localhost:30000`);
};

