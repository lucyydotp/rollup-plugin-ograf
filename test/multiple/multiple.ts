import {it} from "node:test";
import {rollup} from "rollup";
import {ograf} from "../../src/index.js";
import * as assert from "node:assert";
import {assertFileExists} from "../util.js";

it("builds multiple graphics with shared contents", async () => {

    const build = await rollup({
        input: [
            "one.ograf.json",
            "two.ograf.json",
        ].map(file => import.meta.resolve(`./src/${file}`).replace("file:", "")),
        plugins: [ograf()]
    })
    const gen = await build.generate({format: "esm"})

    assert.strictEqual(gen.output.length, 5, "wrong amount of outputs")
    assertFileExists(gen, "one.js")
    assertFileExists(gen, "one.ograf.json")
    assertFileExists(gen, "two.js")
    assertFileExists(gen, "two.ograf.json")
})