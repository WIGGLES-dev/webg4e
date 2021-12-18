import { Dice } from "./dice";
export const DamageProgressions = {
  BasicSet: {
    calculateThrust(strength: number) {
      if (strength < 19) {
        return Dice.from(1, -(6 - (strength - 1) / 2));
      }
      strength -= 11;
      if (strength > 50) {
        strength--;
        if (strength > 79) {
          strength -= 1 + (strength - 80) / 5;
        }
      }
      return Dice.from(strength / 8 + 1, (strength % 8) / 2 - 1);
    },
    calculateSwing(strength: number) {
      if (strength < 10) {
        return Dice.from(1, -(5 - (strength - 1) / 2));
      }
      if (strength < 28) {
        strength -= 9;
        return Dice.from(strength / 4 + 1, (strength % 4) - 1);
      }
      if (strength > 40) {
        strength -= (strength - 40) / 5;
      }
      if (strength > 59) {
        strength++;
      }
      strength += 9;
      return Dice.from(strength / 8 + 1, (strength % 8) / 2 - 1);
    },
  },
  KnowingYourOwnStrength: {},
  NoSchoolGrognad: {},
  ThrustEqualsSwingMinus2: {},
};
