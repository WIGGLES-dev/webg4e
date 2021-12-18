import { Component, System } from "..";
export enum SkillDifficulty {
  Easy,
  Average,
  Hard,
  VeryHard,
  Wildcard,
}
export enum LevelType {
  Skill,
  Spell,
  Technique,
}
export class Level extends Component {
  type = LevelType.Skill;
  points = 0;
  difficulty = SkillDifficulty.Average;
  name = "";
  specialization = "";
  limit?: number;
  get relative(): number {
    let rl = 0;
    let points = this.points;
    switch (this.type) {
      case LevelType.Skill: {
        if (this.difficulty === SkillDifficulty.Wildcard) {
          points /= 3;
        }
        if (points === 1) {
        } else if (points < 4) {
          rl += 1;
        } else {
          rl += 1 + points / 4;
        }
      }
      case LevelType.Technique: {
        switch (this.difficulty) {
          case SkillDifficulty.Hard: {
            points--;
            if (points > 0) {
              rl = points;
            }
            if (rl !== 0) {
              rl += rl;
            }
            if (typeof this.limit === "number") {
              if (rl > this.limit) {
                rl = this.limit;
              }
            }
          }
        }
      }
    }
    return rl;
  }
}

class CalculateLevels extends System {
  run() {
    for (const [level] of this.world.query(Level)) {
    }
  }
}
