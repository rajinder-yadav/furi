# BOM - Bill of Material

The following tools, technologies and software was used in the development of FURI.

## Core dependencies

These are the direct dependencies that impact the source code.

Item | Version | Description
--- | --- | ---
TypeScript | 5.7.3 | A superset of JavaScript that adds static typing and other features to the language.
node | 22 LTS | Node.js core APIs.
yaml | 2.7.0 | A library for parsing YAML used to read FURI configuration file.
@deno/dnt | 0.41.3 | A tool for building NPM packages.
@std/assert | 1.0.11 | Deno standard library for assertions, used in test code.

## Web middleware dependencies

Item | Version | Description
--- | --- | ---
mime-types|2.1.35| The ultimate javascript content-type utility.

## Runtime dependencies

These dependencies were used to develop the framework.

Item | Version | Description
--- | --- | ---
Deno | 2.2.1 | A runtime environment for JavaScript that aims to be secure and fast.
Linux | 6.13.1-1-default | openSUSE Tumbleweed with KDE desktop

## Testing dependencies

The following runtime dependencies were used to test the NPM package of the framework.

Item | Version | Description
--- | --- | ---
Deno | 2.2.1 | A runtime environment for JavaScript that aims to be secure and fast.
Node.js | 20.18.3 LTS | The runtime environment for JavaScript.
Bun | 1.2.4 | A modern JavaScript runtime with a focus on speed and simplicity.
