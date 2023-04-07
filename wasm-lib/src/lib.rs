mod utils;

use serde::Serialize;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// impl wasm_bindgen::JsO

#[derive(Serialize)]
struct Coefficients {
    positive: Vec<(f64, f64)>,
    negative: Vec<(f64, f64)>,
    zero: (f64, f64),
}

fn complex_mult(a: (f64, f64), b: (f64, f64)) -> (f64, f64) {
    (a.0 * b.0 - a.1 * b.1, a.0 * b.1 + a.1 * b.0)
}

const INTERPOLATION_AMOUNT: usize = 20;

#[wasm_bindgen]
pub fn get_coefficients(points: Vec<js_sys::Float64Array>, extent: isize) -> JsValue {
    let interpolated_points = points.iter().enumerate().flat_map(|(i, v_a)| {
        let j = if i + 1 == points.len() { 0 } else { i + 1 };
        let v_b = &points[j];
        (0..INTERPOLATION_AMOUNT).map(move |t| {
            (
                v_a.get_index(0)
                    + (v_b.get_index(0) - v_a.get_index(0))
                        * (t as f64 / INTERPOLATION_AMOUNT as f64),
                v_a.get_index(1)
                    + (v_b.get_index(1) - v_a.get_index(1))
                        * (t as f64 / INTERPOLATION_AMOUNT as f64),
            )
        })
    });

    let coef = |n: isize| {
        let mut sum = (0.0, 0.0);
        for (i, p) in interpolated_points.clone().enumerate() {
            let t = i as f64 / ((points.len() * INTERPOLATION_AMOUNT) as f64);

            let angle = -2.0 * std::f64::consts::PI * t * (n as f64);
            let rot = (angle.cos(), angle.sin());

            let mult = complex_mult(rot, p);

            sum.0 += mult.0;
            sum.1 += mult.1;
        }
        sum.0 /= points.len() as f64 * INTERPOLATION_AMOUNT as f64;
        sum.1 /= points.len() as f64 * INTERPOLATION_AMOUNT as f64;
        sum
    };

    let mut positive = vec![];
    let mut negative = vec![];
    for n in 1..=extent {
        positive.push(coef(n));
        negative.push(coef(-n));
    }
    let zero = coef(0);

    let ret = Coefficients {
        positive,
        negative,
        zero,
    };
    serde_wasm_bindgen::to_value(&ret).unwrap()
}
