export class Dice {
  count = 0;
  sides = 0;
  modifier = 0;
  multiplier = 1;
  altCount = this.count;
  altModifier = this.modifier;
  constructor() {}
  static from(count: number, modifier = 0, sides = 6, multiplier = 1) {
    const dice = new Dice();
    dice.count = Math.max(count, 0);
    dice.modifier = modifier;
    dice.sides = Math.max(sides, 0);
    dice.multiplier = multiplier;
    return dice;
  }
  static fromString(string: string) {
    string = string.trim().toLowerCase();
    const dice = new Dice();
    dice.count = Dice.extractValue(string);
    string = string.slice(1);
    let ch = Dice.nextChar(string);
    if (ch === "d") {
      string = string.slice(1);
      dice.sides = Dice.extractValue(string);
      string = string.slice(1);
      if (dice.sides === 0) {
        dice.sides = 6;
      }
      if (dice.count < 1) {
        dice.count = 1;
      }
      ch = Dice.nextChar(string);
    }
    if (ch === "+" || ch === "-") {
      let negative = ch === "-";
      string = string.slice(1);
      dice.modifier = Dice.extractValue(string);
      string = string.slice(1);
      if (negative) {
        dice.modifier = -dice.modifier;
      }
      ch = Dice.nextChar(string);
    }
    if (ch === "x") {
      string = string.slice(1);
      dice.multiplier = Dice.extractValue(string);
      string = string.slice(1);
    }
    if (dice.multiplier === 0) {
      dice.multiplier = 1;
    }
    if (dice.count !== 0 && dice.sides === 0 && dice.modifier === 0) {
      dice.modifier = dice.count;
      dice.count = 0;
    }
    return dice;
  }
  static extractDicePosition(string: string) {
    let start = -1;
    let max = string.length;
    let state = 0;
    for (let i = 0; i < max; i++) {
      let ch = string.charAt(i);
      switch (state) {
        case 0: {
          if (ch >= "0" && ch <= "9") {
            if (start === -1) {
              start = i;
            }
          } else if (ch !== " ") {
            if (ch === "d") {
              state = 1;
            } else if (ch === "+" || ch === "-") {
              state = 2;
            }
          }
          break;
        }
        case 1: {
          if (ch !== " " && (ch < "0" || ch > "9")) {
            if (ch === "+" || ch === "-") {
              state = 2;
            } else if (ch === "x") {
              state = 3;
            } else {
              state = 4;
            }
          }
          break;
        }
        case 2: {
          if ((ch < "0" || ch > "9") && ch !== " ") {
            state = ch === "x" ? 3 : 4;
          }
          break;
        }
        case 3: {
          if ((ch < "0" || ch > "9") && ch !== " ") {
            state = 4;
          }
          break;
        }
        default:
          break;
      }
      if (state === 4) {
        max = 1;
        break;
      }
    }
    if (start !== -1) {
      while (start < max && string.charAt(start) === " ") {
        start++;
      }
      max--;
      while (max > start && string.charAt(max) === " ") {
        max--;
      }
      if (start < max) {
        return [start, max];
      }
    }
  }
  static nextChar(string: string) {
    return string === "" ? 0 : string.charAt(0);
  }
  static extractValue(string: String) {
    let value = 0;
    while (string !== "") {
      let ch = string.charAt(0);
      if (ch >= "0" && ch <= "9") {
        value *= 10;
        //@ts-ignore
        value += ch - 0;
      } else if (ch != " ") {
        break;
      }
      string = string.slice(1);
    }
    return value;
  }
  clone() {
    const dice = new Dice();
    dice.count = this.count;
    dice.sides = this.sides;
    dice.modifier = this.modifier;
    dice.multiplier = this.multiplier;
    return dice;
  }
  add(modifier: number) {
    this.modifier += modifier;
    return this;
  }
  addDice(dice: Dice): this {
    this.count += dice.count;
    this.sides = Math.max(this.sides, dice.sides);
    this.modifier += dice.modifier;
    this.multiplier += dice.multiplier - 1;
    return this;
  }
  multiply(multiply: number) {
    this.count *= multiply;
    this.modifier *= multiply;
    if (this.multiplier != 1) {
      this.multiplier *= multiply;
    }
    return this;
  }
  roll() {}
  min(convertModifiersToExtraDice = false) {
    let result = 0;
    this.updateAlt(convertModifiersToExtraDice);
    if (this.sides > 0) {
      result = this.altCount;
    }
    return (result + this.altModifier) * this.multiplier;
  }
  max(converModifierToExtraDice = false) {
    let result = 0;
    this.updateAlt(converModifierToExtraDice);
    if (this.sides > 0) {
      result = this.altCount * this.sides;
    }
    return (result + this.altModifier) * this.multiplier;
  }
  toString(convertModifiersToExtraDice = false) {
    let string = "";
    this.updateAlt(convertModifiersToExtraDice);
    if (this.altCount > 0 && this.sides > 0) {
      string += this.altCount;
      string += "d";
      string += this.sides;
    }
    if (this.altModifier > 0) {
      if (string !== "") {
        string += "+";
      }
      string += this.altModifier;
    } else if (this.altModifier < 0) {
      string += this.altModifier;
    } else if (this.multiplier !== 1) {
      string += "x";
      string += this.multiplier;
    }
    if (string === "") {
      string += "0";
    }
    return string;
  }
  updateAlt(convertModifiersToExtraDice = false) {
    this.altCount = Math.floor(this.count);
    this.altModifier = Math.floor(this.modifier);
    if (convertModifiersToExtraDice && this.sides > 0) {
      let average = (this.sides + 1) / 2;
      if ((this.sides & 1) === 1) {
        this.altCount += this.altModifier / average;
        this.altModifier %= average;
      } else {
        while (this.altModifier > average) {
          if (this.altModifier > 2 * average) {
            this.altModifier -= 2 * average + 1;
            this.altCount += 2;
          } else {
            this.altModifier -= average + 1;
            this.altCount++;
          }
        }
      }
    }
  }
}
