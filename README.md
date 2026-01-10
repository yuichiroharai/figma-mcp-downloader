# figma-mcp-downloader

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

---

## get_design_context

Get the design context for a layer or selection and save the full JSON response from the MCP tool to a file.

> [!NOTE]
> The MCP response contains multiple content items: the first is the generated JSX code, and the rest are supplementary AI guidance.

```bash
npx figma-mcp-downloader get_design_context <output-file> [options]
```

| Argument/Option                        | Figma MCP Parameter | Description                                 |
| -------------------------------------- | ------------------- | ------------------------------------------- |
| `<output-file>`                        | -                   | Output file path                            |
| `-c, --content-only`                   | -                   | Save only the first text content (JSX code) |
| `-i, --node-id <id>`                   | `nodeId`            |                                             |
| `-a, --artifact-type <type>`           | `artifactType`      |                                             |
| `-t, --task-type <type>`               | `taskType`          |                                             |
| `-l, --client-languages <languages>`   | `clientLanguages`   |                                             |
| `-f, --client-frameworks <frameworks>` | `clientFrameworks`  |                                             |

> [!NOTE]
> Options without descriptions are identical to the corresponding Figma MCP tool parameters. Refer to the Figma MCP tool schema for details.
> This CLI always sets `forceCode` to `true` when calling the MCP tool.

```bash
# With -c: saves JSX only
npx figma-mcp-downloader get_design_context design_context.jsx -i "123:456" -c
# Without -c: saves full JSON response
npx figma-mcp-downloader get_design_context design_context.json -i "123:456"
```

---

## get_metadata

Get the sparse XML representation for a layer or selection and save the full JSON response from the MCP tool to a file.

> [!NOTE]
> The MCP response contains multiple content items: the first is the generated XML, and the rest are supplementary AI guidance.

```bash
npx figma-mcp-downloader get_metadata <output-file> [options]
```

| Argument/Option                        | Figma MCP Parameter | Description                            |
| -------------------------------------- | ------------------- | -------------------------------------- |
| `<output-file>`                        | -                   | Output file path                       |
| `-c, --content-only`                   | -                   | Save only the first text content (XML) |
| `-i, --node-id <id>`                   | `nodeId`            |                                        |
| `-l, --client-languages <languages>`   | `clientLanguages`   |                                        |
| `-f, --client-frameworks <frameworks>` | `clientFrameworks`  |                                        |

> [!NOTE]
> Options without descriptions are identical to the corresponding Figma MCP tool parameters. Refer to the Figma MCP tool schema for details.

```bash
# With -c: saves XML only
npx figma-mcp-downloader get_metadata metadata.xml -i "123:456" -c
# Without -c: saves full JSON response
npx figma-mcp-downloader get_metadata metadata.json -i "123:456"
```

---

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
