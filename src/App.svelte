<script lang="ts">
    import { onMount } from "svelte";
    import p5, { Vector } from "p5";
    import { initSketch, type SketchData } from "./sketch";

    let p5Div: HTMLDivElement;
    // let p5Size = new Vector(0, 0);
    // let p5Pos = new Vector(0, 0);

    let sketchData: SketchData;

    let accuracy = 200;
    let frameRate = 60;

    onMount(() => {
        sketchData = initSketch(
            p5Div,
            () => accuracy,
            () => frameRate
        );
        new p5(sketchData.sketch, p5Div);
    });
</script>

<svelte:window
    on:pointermove={e => {
        sketchData.mouseMove(e);
    }}
    on:pointerup={e => {
        sketchData.mouseUp(e);
    }}
/>

<div class="everything">
    <!-- fdg -->
    <div class="container">
        <div class="ui">
            <div class="title">Fourier Drawing Simulator</div>
            <div class="setting">
                <span>Accuracy:</span>
                <input
                    type="range"
                    bind:value={accuracy}
                    min={0}
                    max={1000}
                    step={25}
                    style:width="100px"
                />
                <span style:width="40px" style:text-align="center"
                    >{accuracy}</span
                >
            </div>
            <div class="setting">
                <span>FPS:</span>
                <input
                    type="range"
                    bind:value={frameRate}
                    min={10}
                    max={240}
                    style:width="100px"
                />
                <span style:width="40px" style:text-align="center"
                    >{frameRate}</span
                >
            </div>
        </div>
        <div
            class="p5_div"
            bind:this={p5Div}
            on:pointerdown={e => {
                sketchData.mouseDown(e);
            }}
        />
        <div class="footer">
            Made by Ursu Radu
            <a
                class="github_link"
                href="https://github.com/Ursu-Radu/fourier-drawing"
                target="_blank"
            >
                <img
                    src="github-mark-white.svg"
                    alt="Github"
                    width="30px"
                    height="30px"
                />
            </a>
        </div>
    </div>
</div>

<style>
    button {
        border: none;
    }
    .everything {
        position: absolute;
        width: 100vw;
        height: 100vh;
        padding: 12px;
    }
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .footer {
        width: 100%;
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 8px;
        color: #fffa;
    }
    .github_link {
        width: 30px;
        height: 30px;
        opacity: 0.5;

        cursor: pointer;

        transition: all ease-in-out 0.1s;
    }
    .github_link:hover {
        opacity: 0.8;
    }
    .ui {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .title {
        font-size: x-large;
    }
    .setting {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .setting > span {
        font-family: "Source Code Pro", monospace;
    }
    .setting > input {
        margin-top: 3px;
    }
    .p5_div {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        border: solid 2px #9595bf;
        /* background-color: #1d1d35; */
        overflow: hidden;
        touch-action: none;
    }
    :global(.p5_div > *) {
        display: block;
    }
</style>
