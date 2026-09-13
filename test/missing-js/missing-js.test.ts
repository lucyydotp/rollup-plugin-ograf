import {it} from "node:test";
import {rollup} from "rollup";
import {ograf} from "../../src/index.js";
import * as assert from "node:assert";

it("throws when an ograf manifest has no matching main file", () => assert.rejects(async () => {
            const build = await rollup({
                input: import.meta.resolve("./src/missing-main.ograf.json").replace("file:", ""),
                plugins: [ograf()]
            })
            const gen = await build.generate({format: "esm"})
        },
        /this-file-does-not-exist\.js/,
    )
)

it("throws when an ograf manifest does not define a main", () => assert.rejects(async () => {
            const build = await rollup({
                input: import.meta.resolve("./src/no-main.ograf.json").replace("file:", ""),
                plugins: [ograf()]
            })
            const gen = await build.generate({format: "esm"})
        },
        /Missing or invalid 'main'/,
    )
)