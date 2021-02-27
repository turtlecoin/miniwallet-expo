export const humanToAtomic = (n: number): number =>
    (Math.ceil(n * 100) / 100) * 100;
