import { Component } from "ecs";

enum Difficulty {
  Easy,
  Average,
  Hard,
  VeryHard,
  Wildcard,
}
export class Level extends Component {
  points = 0;
  difficulty = Difficulty.Average;
}

export class Encumbrance extends Component {
  weight = 0;
}

enum FeatureType {
  NA = "N/A",
}
export class Feature extends Component {
  type = FeatureType.NA;
}
