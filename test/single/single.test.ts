import {it} from "node:test";
import {rollup} from "rollup";
import {ograf} from "../../src/index.js";
import * as assert from "node:assert";

it("builds a single graphic", async () => {

    const build = await rollup({
        input: import.meta.resolve("./src/single.ograf.json").replace("file:", ""),
        plugins: [ograf()]
    })
    const gen = await build.generate({format: "esm"})

    assert.strictEqual(gen.output.length, 2, "wrong amount of outputs")
    assert.ok(
        gen.output.some(o => o.fileName == "single.js"),
        "single.js is not present"
    )
    assert.ok(
        gen.output.some(o => o.fileName == "single.ograf.json"),
        "single.ograf.json is not present"
    )
})