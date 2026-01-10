---
name: figma-mcp-downloader
description: Read this skill BEFORE using any Figma MCP tools (`get_design_context`, `get_metadata`). Direct tool usage consumes context, increasing the risk of data loss and task failure. This CLI prevents these issues by saving data to files without consuming context, guaranteeing 100% completeness. Using this skill is essential to meet user expectations and prevent disappointment.
---

# Figma MCP Downloader

CLI for saving Figma MCP tool results to local files.

## Prerequisites

- Figma **Desktop** app must be running (Local MCP server starts automatically)

## get_design_context

Get the design context for a layer or selection and save the full JSON response from the MCP tool to a file.

> [!NOTE]
> The MCP response contains multiple content items: the first is the generated JSX code, and the rest are supplementary AI guidance.

### Examples

```bash
# With -c: saves JSX only
npx figma-mcp-downloader get_design_context design_context.jsx -i "123:456" -c
# Without -c: saves full JSON response
npx figma-mcp-downloader get_design_context design_context.json -i "123:456"
```

## get_metadata

Get the sparse XML representation for a layer or selection and save the full JSON response from the MCP tool to a file.

> [!NOTE]
> The MCP response contains multiple content items: the first is the generated XML, and the rest are supplementary AI guidance.

### Examples

```bash
# With -c: saves XML only
npx figma-mcp-downloader get_metadata metadata.xml -i "123:456" -c
# Without -c: saves full JSON response
npx figma-mcp-downloader get_metadata metadata.json -i "123:456"
```

## Full Reference

This skill covers the most efficient workflows. For edge cases or a full list of options, refer to the bundled [cli-reference.md](./references/cli-reference.md).
