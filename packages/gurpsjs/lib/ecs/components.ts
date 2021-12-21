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
  baseLevel?: number;
}

export class Default extends Component {}

export class Encumbrance extends Component {
  weight = 0;
}

enum FeatureType {}
export class Feature extends Component {
  type?: FeatureType;
}

export class AttributeList {}
