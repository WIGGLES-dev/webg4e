import { World } from "ecs";
import { GURPSPlugin } from "./world";
import { Features, Level, Difficulty, Link } from "./components";
export const GURPS = new World().addPlugin(new GURPSPlugin());

GURPS.spawn(
  new Level({
    difficulty: Difficulty.VeryHard,
    points: 8,
  }),
  new Link({
    that: new Map().set(Level, {}),
  }),
  new Features([])
);

GURPS.tick();

const q = GURPS.query(Level);
const q2 = q.map(([level]) => level.data.baseLevel || 0 * 2);
