import type {RollupOutput} from "rollup";
import * as assert from "node:assert";

/**
 * Asserts that a file exists in rollup output.
 */
export function assertFileExists(output: RollupOutput, path: string) {
    assert.ok(output.output.some(o => o.fileName == path), `${path} is not present`);
}