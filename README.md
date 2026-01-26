# figma-mcp-downloader

[![npm version](https://img.shields.io/npm/v/figma-mcp-downloader.svg)](https://www.npmjs.com/package/figma-mcp-downloader)
[![Build](https://github.com/yuichiroharai/figma-mcp-downloader/actions/workflows/build.yml/badge.svg)](https://github.com/yuichiroharai/figma-mcp-downloader/actions/workflows/build.yml)

CLI for saving Figma MCP tool results to local files.

> [!IMPORTANT]
> This documentation is written exclusively for AI agents with access to the Figma MCP tool schema.

## Prerequisites

- Figma **Desktop** app must be running (Local MCP server starts automatically)

## Installation

```bash
npm install -g figma-mcp-downloader
```

Or run directly with `npx`:

```bash
npx figma-mcp-downloader <subcommand> [options]
```

## Subcommands and MCP Tool Mapping

Subcommands share the same names as MCP tools.

| Subcommand           | MCP Tool             |
| -------------------- | -------------------- |
| `get_design_context` | `get_design_context` |
| `get_metadata`       | `get_metadata`       |

> [!NOTE]  
> Other Figma MCP tools (e.g., `get_screenshot`, `get_variable_defs`) are not currently supported by this CLI.

```bash
npx figma-mcp-downloader [subcommand] <output-file> [options]
```

## Common Arguments/Options

> [!IMPORTANT]  
> Options without descriptions are identical to the corresponding Figma MCP tool parameters. Refer to the Figma MCP tool schema for details.  
> The MCP response contains multiple content items: the first is the generated JSX code or XML, and the rest are supplementary AI guidance. Use `-c` to extract only the JSX code or XML.

| Argument/Option                        | Figma MCP Parameter | Description                                                         |
| -------------------------------------- | ------------------- | ------------------------------------------------------------------- |
| `<output-file>`                        | -                   | Output file path                                                    |
| `-c, --content-only`                   | -                   | Save only the first text content (JSX code or XML)                  |
| `-i, --node-id <id>`                   | `nodeId`            | The ID of the node in the Figma document.                           |
| `-l, --client-languages <languages>`   | `clientLanguages`   | A comma separated list of programming languages used by the client. |
| `-f, --client-frameworks <frameworks>` | `clientFrameworks`  | A comma separated list of frameworks used by the client             |

> [!NOTE]  
> Both `-l` and `-f` options are used for logging purposes to understand which languages and frameworks are being used. Specify them based on available context, but omit them if unsure.

## get_design_context

Get the design context for a layer or selection and save the full JSON response from the MCP tool to a file.

```bash
npx figma-mcp-downloader get_design_context <output-file> [options]
```

> [!IMPORTANT]  
> This CLI always sets `forceCode` to `true` when calling the MCP tool.

| Argument/Option                     | Figma MCP Parameter | Description                                                                         |
| ----------------------------------- | ------------------- | ----------------------------------------------------------------------------------- |
| `-a, --artifact-type <type>`        | `artifactType`      | The type of artifact the user is creating or modifying.                             |
| `-t, --task-type <type>`            | `taskType`          | The type of task being performed.                                                   |
| `-d, --dir-for-asset-writes <path>` | `dirForAssetWrites` | The directory to write image, vector and video assets to (Must be an absolute path) |

> [!NOTE]
> Valid values for `-a`: `WEB_PAGE_OR_APP_SCREEN`, `COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN`, `REUSABLE_COMPONENT`, `DESIGN_SYSTEM`
> Valid values for `-t`: `CREATE_ARTIFACT`, `CHANGE_ARTIFACT`, `DELETE_ARTIFACT`
> The `-d` option is required when Figma Desktop's "Image source" is set to "Download". It has no effect with "Local server".

### Examples

```bash
# With -c: saves JSX only
npx figma-mcp-downloader get_design_context design_context.jsx -i "123:456" -c -l typescript -f react,tailwindcss
# Without -c: saves full JSON response
npx figma-mcp-downloader get_design_context design_context.json -i "123:456" -l html,css,javascript -f vue
# With -d: download assets to a directory (required when "Image source" is "Download")
npx figma-mcp-downloader get_design_context design_context.jsx -i "123:456" -c -d /home/user/my-project/src/public/images -l typescript -f react,tailwindcss
```

## get_metadata

Get the sparse XML representation for a layer or selection and save the full JSON response from the MCP tool to a file.

```bash
npx figma-mcp-downloader get_metadata <output-file> [options]
```

### Examples

```bash
# With -c: saves XML only
npx figma-mcp-downloader get_metadata metadata.xml -i "123:456" -c -l typescript -f react,tailwindcss
# Without -c: saves full JSON response
npx figma-mcp-downloader get_metadata metadata.json -i "123:456" -l html,css,javascript -f vue
```

## Environment Variables

The MCP server URL can be configured via environment variables.

| Variable        | Description    | Default                     |
| --------------- | -------------- | --------------------------- |
| `FIGMA_MCP_URL` | MCP server URL | `http://127.0.0.1:3845/mcp` |

```bash
# PowerShell
$env:FIGMA_MCP_URL="http://localhost:4000/mcp"; npx figma-mcp-downloader get_design_context design_context.jsx -c

# Linux/Mac
FIGMA_MCP_URL="http://localhost:4000/mcp" npx figma-mcp-downloader get_metadata metadata.xml -c
```
