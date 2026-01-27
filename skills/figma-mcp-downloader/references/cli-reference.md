# CLI Reference

## Subcommands and MCP Tool Mapping

Subcommands share the same names as MCP tools.

| Subcommand           | MCP Tool             |
| -------------------- | -------------------- |
| `get_design_context` | `get_design_context` |
| `get_metadata`       | `get_metadata`       |

```bash
npx figma-mcp-downloader [subcommand] <output-file> [options]
```

## Common Arguments/Options

> [!IMPORTANT]  
> Options without descriptions are identical to the corresponding Figma MCP tool parameters. Refer to the Figma MCP tool schema for details.  
> The MCP response contains multiple content items: the first is the generated JSX code or XML, and the rest are supplementary AI guidance. Use `-c` to extract only the JSX code or XML.

| Argument/Option                        | Figma MCP Parameter | Description                                                                    |
| -------------------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| `<output-file>`                        | -                   | Output file path                                                               |
| `-c, --content-only`                   | -                   | Save only the first text content (JSX code or XML), not the full JSON response |
| `-i, --node-id <id>`                   | `nodeId`            | The ID of the node in the Figma document                                       |
| `-l, --client-languages <languages>`   | `clientLanguages`   | A comma separated list of programming languages used by the client             |
| `-f, --client-frameworks <frameworks>` | `clientFrameworks`  | A comma separated list of frameworks used by the client                        |

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
| `-a, --artifact-type <type>`        | `artifactType`      | The type of artifact the user is creating or modifying                              |
| `-t, --task-type <type>`            | `taskType`          | The type of task being performed                                                    |
| `-d, --dir-for-asset-writes <path>` | `dirForAssetWrites` | The directory to write image, vector and video assets to (Must be an absolute path) |

> [!NOTE]
> Valid values for `-a`: `WEB_PAGE_OR_APP_SCREEN`, `COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN`, `REUSABLE_COMPONENT`, `DESIGN_SYSTEM`
> Valid values for `-t`: `CREATE_ARTIFACT`, `CHANGE_ARTIFACT`, `DELETE_ARTIFACT`
> The `-d` option is required when Figma Desktop's "Image source" is set to "Download". It has no effect with "Local server".

## get_metadata

Get the sparse XML representation for a layer or selection and save the full JSON response from the MCP tool to a file.

```bash
npx figma-mcp-downloader get_metadata <output-file> [options]
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
