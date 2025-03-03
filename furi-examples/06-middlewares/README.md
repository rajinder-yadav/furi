# Furi Server Example

Simple HTTP server using the Furi framework.

Calling "__listen()__" with custom "__server__" configuration. You may pass one or more open in the server configuration object.

The following "__server__" options are available:

```ts
server: {
env: string;                    // Run-time environment (development, production).
port: number;                   // Port server will listen for connection requests.
host: string;                   // host server will listen for connection requests.
callback: null | (() => void);  // Callback function that will be called when server is ready.
},
```

## Installation and Running

```sh
deno install
deno run dev
```

## Default Server setting

- Port: 8000
- Host: localhost
- Environment: development

## Server Configuration

You can create a YAML file named "furi.yaml" or "furi.yml" to change Furi server settings.

"__furi.yaml__"

```txt
server:
  port: 3333
  host: localhost
  env: staging
```
