export function between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function roundToOneDecimal(num: number): number {
  return Number(num.toFixed(1));
}
