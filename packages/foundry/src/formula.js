import { Dice } from "./dice.js"
export function speedRange(distance) {
  const penalty = Math.round(2 - 6 * Math.log10(distance))
  return Math.min(0, penalty)
}
export function size(length) {
  return 6 * Math.log10(length) - 2
}
export function linearMeasurement(size) {
  if (size >= 0) {
    // 2,3,5,7,10,15
    const step = Math.floor(size / 6)
    const round = size - step * 6
    const pow = Math.pow(10, step + 1)
    switch (round) {
      case 0:
        return 2 * pow
      case 1:
        return 3 * pow
      case 2:
        return 5 * pow
      case 3:
        return 7 * pow
      case 4:
        return 10 * pow
      case 5:
        return 15 * pow
    }
  } else {
    return 0
  }
}

export const DamageProgression = {
  BasicSet: {
    calculateThrust(strength) {
      if (strength < 19) {
        return Dice.from(1, -(6 - (strength - 1) / 2))
      }
      strength -= 11
      if (strength > 50) {
        strength--
        if (strength > 79) {
          strength -= 1 + (strength - 80) / 5
        }
      }
      return Dice.from(strength / 8 + 1, (strength % 8) / 2 - 1)
    },
    calculateSwing(strength) {
      if (strength < 10) {
        return Dice.from(1, -(5 - (strength - 1) / 2))
      }
      if (strength < 28) {
        strength -= 9
        return Dice.from(strength / 4 + 1, (strength % 4) - 1)
      }
      if (strength > 40) {
        strength -= (strength - 40) / 5
      }
      if (strength > 59) {
        strength++
      }
      strength += 9
      return Dice.from(strength / 8 + 1, (strength % 8) / 2 - 1)
    },
  },
  KnowingYourOwnStrength: {},
  NoSchoolGrognad: {},
  ThrustEqualsSwingMinus2: {},
}
