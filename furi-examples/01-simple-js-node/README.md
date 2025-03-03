# Furi Server Example

Simple HTTP server using the Furi framework.

## Installation and Running

```sh
npm install
npm run dev
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

## Node.js ES Module

If you are using "__import__" in your source code, as in this example codem make sure to add the following line to "__package.json__":

```json
"type": "module",
```
