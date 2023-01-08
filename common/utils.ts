export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function getDistanceFastNoSqrt(p1: number[], p2: number[], useZ: boolean = true): number {
  const [x1, y1, z1] = p1;
  const [x2, y2, z2] = p2;
  const result = (x1 - x2) ** 2 + (y1 - y2) ** 2;
  if (useZ) return result + (z1 - z2) ** 2;
  return result;
}

const roundFloat = (number: number) => Math.round(number * 10) / 10;
