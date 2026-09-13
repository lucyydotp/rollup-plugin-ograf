import fs from "node:fs/promises"
import path from "node:path/posix"
import type {Plugin} from "rollup"

const OGRAF_JSON_EXTENSION = ".ograf.json"

/**
 * Allows OGraf manifest files to be used as entrypoints.
 */
export function ograf(): Plugin {
    return {
        name: "ograf",

        async resolveId(source, importer, opts) {
            if (!source.endsWith(OGRAF_JSON_EXTENSION)) return null;
            return {
                id: path.resolve(path.dirname(importer ?? "."), source)
            }
        },

        async load(id) {
            if (!id.endsWith(OGRAF_JSON_EXTENSION)) return null;

            const jsonFile = await fs.readFile(id, "utf-8")

            let manifest: any;
            try {
                manifest = JSON.parse(jsonFile ?? "");
            } catch (e) {
                throw new Error(`Invalid JSON: ${e}`);
            }

            if (typeof manifest?.main != "string") {
                throw new Error(`Missing or invalid 'main'`)
            }

            // Emit the JS file as an entrypoint
            this.emitFile({
                type: "chunk",
                id: path.resolve(id, '..', manifest.main),
                fileName: manifest.main, // Preserve its name, so we don't need to deal with chunk renaming
                preserveSignature: "strict", // Keep the default export

            })

            // Emit the resolved manifest as an asset verbatim
            this.emitFile({
                type: "asset",
                fileName: path.basename(id),
                source: jsonFile,
            })

            // Re-export the JSON as a JS module (removed later, we don't need it)
            return {
                code: "export default " + JSON.stringify(manifest, null, 4),
                moduleSideEffects: false,
                meta: {
                    ograf: true
                }
            }
        },

        generateBundle(options, bundle, isWrite) {
            // Remove any chunks generated from ograf manifests
            for (const [k, v] of Object.entries(bundle)) {
                if (v.type == "chunk" && v.facadeModuleId?.endsWith(OGRAF_JSON_EXTENSION)) {
                    delete bundle[k];
                }
            }
        }
    }
}