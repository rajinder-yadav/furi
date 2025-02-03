# Creating a NPM module with TypeScript 1.8.10

_Ref_: http://stackoverflow.com/questions/30928253/writing-npm-modules-in-typescript

```bash
Project folder

drwxrwxr-x  5 yadav yadav 4096 Aug  9 02:55 ./
drwxrwxr-x 17 yadav yadav 4096 Aug  9 01:47 ../
drwxrwxr-x  3 yadav yadav 4096 Aug  9 02:04 docs/
-rw-rw-r--  1 yadav yadav 5920 Aug  9 02:55 FURI-0.1.0.tgz
drwxrwxr-x  8 yadav yadav 4096 Aug  9 01:47 .git/
drwxrwxr-x  2 yadav yadav 4096 Aug  9 02:42 lib/
-rw-rw-r--  1 yadav yadav  111 Aug  9 02:50 .npmignore
-rw-rw-r--  1 yadav yadav  866 Aug  9 02:53 package.json
-rw-rw-r--  1 yadav yadav 1314 Aug  9 02:52 README.md
-rw-rw-r--  1 yadav yadav  383 Aug  9 02:36 tsconfig.json
-rw-rw-r--  1 yadav yadav 2389 Aug  9 01:50 tslint.json
-rw-rw-r--  1 yadav yadav  253 Aug  9 01:50 typings.json
```


## NPM ignore

```bash
furi:master$ cat .npmignore
node_modules/
*.log
*.tgz

benchmark/
build/
docs/
src/
test/
typings/
tsconfig.json
typings.json
tslint.json
```

## GIT ignore

```bash
furi_node_router:master$ cat .gitignore
build/
node_modules/
typings/
.vscode
*.js
*.js.map
```

`package.json` includes

```js
  "main": "./lib/index.js",
  "typings": "./lib/index.d.ts
```

```js
// File index.ts contains
export * from "./furi";
```

From the project root run:

```bash
npm package
```

Now I go to the project where I want to use this as a library and type:

```bash
npm install ./project-1.0.0.tgz
```

