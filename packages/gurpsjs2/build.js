import { spawn } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const json = JSON.parse(readFileSync("./pkg/package.json").toString());
json.type = "module";
json.main = json.module;
delete json.module;
writeFileSync("./pkg/package.json", JSON.stringify(json, undefined, 2));
