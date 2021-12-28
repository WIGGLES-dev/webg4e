import { World } from "ecs";
import { GURPSPlugin } from "./world";

import { Features, Level, Difficulty, Link } from "./components";

export const GURPS = new World().addPlugin(new GURPSPlugin());

GURPS.spawn(
  Level({
    difficulty: Difficulty.Hard,
    points: 8,
  }),
  Link({
    that: new Map().set(Level, {}),
  }),
  Features()
);

GURPS.tick();

GURPS.query(Level).forEach(console.log);
