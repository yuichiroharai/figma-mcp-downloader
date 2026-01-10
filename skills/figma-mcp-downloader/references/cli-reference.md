# figma-mcp-downloader

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

---

## get_metadata

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
