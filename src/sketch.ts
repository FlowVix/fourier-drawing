import { Vector } from "p5";
import type p5 from "p5";
import { complexMult, type Coefficients } from "./fourier";
import * as wasm from "../wasm-lib/pkg/wasm_lib";

export interface SketchData {
    sketch: (p: p5) => void;
    mouseDown: (e: PointerEvent) => void;
    mouseMove: (e: PointerEvent) => void;
    mouseUp: (e: PointerEvent) => void;
}

export const initSketch = (
    p5Div: HTMLDivElement,
    getAccuracy: () => number,
    getFramerate: () => number
): SketchData => {
    let drawPoints: null | Vector[] = null;
    let coefficients: null | Coefficients = null;

    let drawTime = 0;
    let tracePoints: Vector[] = [];

    let mouseDown = (e: PointerEvent) => {
        drawPoints = [];
        coefficients = null;
        tracePoints = [];
    };
    let mouseMove = (e: PointerEvent) => {
        if (coefficients == null && drawPoints != null) {
            let pos = new Vector(e.pageX, e.pageY);
            pos.sub(p5Div.offsetLeft, p5Div.offsetTop);
            pos.sub(p5Div.offsetWidth / 2, p5Div.offsetHeight / 2);

            if (
                drawPoints.length == 0 ||
                pos.dist(drawPoints[drawPoints.length - 1]) > 7.5
            )
                drawPoints.push(pos);
        }
    };
    let mouseUp = (e: PointerEvent) => {
        if (drawPoints != null && coefficients == null) {
            let coefTemp = wasm.get_coefficients(
                drawPoints.map(v => new Float64Array([v.x, v.y])),
                getAccuracy()
            );
            coefficients = {
                positive: coefTemp.positive.map(v => new Vector(v[0], v[1])),
                negative: coefTemp.negative.map(v => new Vector(v[0], v[1])),
                zero: new Vector(coefTemp.zero[0], coefTemp.zero[1]),
            };

            drawTime = 0;
        }
    };

    let sketch = (p: p5) => {
        p.setup = () => {
            p.createCanvas(0, 0);
            p.ellipseMode(p.RADIUS);
            p.frameRate(getFramerate());
        };
        p.draw = () => {
            if (getFramerate() != p.frameRate()) {
                p.frameRate(getFramerate());
            }

            p.resizeCanvas(p5Div.offsetWidth, p5Div.offsetHeight);

            drawTime += 1 / getFramerate();

            // ============= DRAWING =============
            p.background("#131319");

            p.translate(
                p.width / 2 + (p.width % 2) / 2,
                p.height / 2 + (p.height % 2) / 2
            );

            p.strokeWeight(2);
            p.stroke("#282835");
            for (let i = 1; i <= p.width; i += 85) {
                p.line(i, -p.height / 2, i, p.height / 2);
                p.line(-i, -p.height / 2, -i, p.height / 2);
            }
            for (let i = 1; i <= p.height; i += 85) {
                p.line(-p.width / 2, i, p.width / 2, i);
                p.line(-p.width / 2, -i, p.width / 2, -i);
            }

            p.stroke("#4D4D66");
            p.strokeWeight(4);

            p.line(0, -p.height / 2, 0, p.height / 2);
            p.line(-p.width / 2, 0, p.width / 2, 0);

            if (drawPoints != null) {
                p.strokeWeight(coefficients != null ? 2 : 4);
                p.stroke(coefficients != null ? "#75759B" : "#FFDB4C");

                p.noFill();
                p.beginShape();

                for (let v of drawPoints) {
                    p.vertex(v.x, v.y);
                }
                p.endShape();
            }

            if (tracePoints.length > 2) {
                for (let i = 0; i < tracePoints.length - 1; i++) {
                    let v_a = tracePoints[i];
                    let v_b = tracePoints[i + 1];

                    let t = 1 - i / tracePoints.length;

                    p.stroke(
                        p.lerp(255, 117, t ** 2),
                        p.lerp(219, 117, t ** 2),
                        p.lerp(76, 155, t ** 2)
                    );
                    p.strokeWeight(p.lerp(4, 0, t));
                    p.line(v_a.x, v_a.y, v_b.x, v_b.y);
                }
            }

            if (tracePoints.length > 200) {
                tracePoints.shift();
            }

            if (coefficients != null) {
                p.strokeWeight(1);

                let currentPos = new Vector(0, 0);

                const handleArrow = (coef: Vector, n: number) => {
                    let rot = new Vector(1, 0);
                    rot.rotate(drawTime * n);
                    let v = complexMult(coef, rot);

                    let mag = v.mag();
                    if (mag > 3) {
                        p.stroke("#C1C1FF30");
                        p.circle(currentPos.x, currentPos.y, v.mag());
                        p.stroke("#C1C1FF50");
                        p.line(
                            currentPos.x,
                            currentPos.y,
                            currentPos.x + v.x,
                            currentPos.y + v.y
                        );
                    }

                    currentPos.add(v);
                };
                handleArrow(coefficients.zero, 0);
                for (let i = 0; i < coefficients.positive.length; i++) {
                    handleArrow(coefficients.positive[i], i + 1);
                    handleArrow(coefficients.negative[i], -(i + 1));
                }

                p.fill(255, 219, 76);

                p.noStroke();

                p.circle(currentPos.x, currentPos.y, 5);

                if (
                    tracePoints.length == 0 ||
                    currentPos.dist(tracePoints[tracePoints.length - 1]) > 2
                )
                    tracePoints.push(currentPos);
            }
        };
    };

    return {
        sketch,
        mouseDown,
        mouseMove,
        mouseUp,
    };
};
