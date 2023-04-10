# Fourier Epicycles Simulator

This web application allows you to draw any single stroke drawing and observe how it can be drawn using revolving circles.

You can control the **accuracy** of the epicycles (correlates linearily to the amount of circles, accuracy `N` results in `2N + 1` circles), as well as the **framerate** of the simulation.

## For development

This web app uses **Svelte** with **Typescript** and **Vite**, as well as **Rust WebAssembly** for more intensive computations. Drawing is done through **p5.js**.

## To-do

-   Support for importing SVG files could be interesting, but in the case that the file has multiple strokes, there's ambiguity on which stroke to pick while keeping the system intuitive
-   Exporting coefficients, as .TXT or maybe even .CSV or .JSON files
