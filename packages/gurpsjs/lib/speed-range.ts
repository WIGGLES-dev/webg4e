export class SpeedRange {
  static rangePenalty(distance: number) {
    const penalty = Math.round(2 - 6 * Math.log10(distance));
    return Math.min(0, penalty);
  }
  static size(length: number) {
    return 6 * Math.log10(length) - 2;
  }
}
