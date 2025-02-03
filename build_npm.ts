import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/furi.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "furi",
    version: Deno.args[0],
    description:
      "Boolean function that returns whether or not parameter is the number 42",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/rajinder-yadav/furi.git",
    },
    bugs: {
      url: "https://github.com/rajinder-yadav/furi/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
