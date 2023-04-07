import { Vector } from "p5";

export const PI = 3.141592653589793238462643383279502884197;

export const complexMult = (a: Vector, b: Vector) =>
    new Vector(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);

export interface Coefficients {
    positive: Vector[];
    negative: Vector[];
    zero: Vector;
}
