import { build, emptyDir } from "@deno/dnt";

await emptyDir("./dist");

await build({
  entryPoints: ["./lib/furi.ts"],
  outDir: "./dist",
  test:false,
  shims: {
    deno: true,
  },
  package: {
    name: "@furi-server/furi",
    version: Deno.args[0],
    description:
      "Fast Node.js HTTP server framework",
    license: "GPL-3.0",
    repository: {
      type: "git",
      url: "git+https://github.com/rajinder-yadav/furi.git",
    },
    bugs: {
      url: "https://github.com/rajinder-yadav/furi/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("README.md", "dist/README.md");
  },
});
