# Furi Server Example

Simple HTTP server using the Furi framework.

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
