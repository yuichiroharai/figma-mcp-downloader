import { Command } from "commander";
import { ToolResult } from "./types.js";
import {
  closeMcpTransport,
  createMcpClient,
  handleError,
  saveResult,
} from "./utils.js";

interface Options {
  nodeId?: string;
  clientLanguages?: string;
  clientFrameworks?: string;
  contentOnly?: boolean;
  force?: boolean;
}

export function registerGetMetadataCommand(program: Command): void {
  program
    .command("get_metadata")
    .description(
      "Get the sparse XML representation for a layer or selection and save the full JSON response from the MCP tool to a file.",
    )
    .argument(
      "<output-file>",
      "Output file path, e.g., metadata.xml, metadata.json",
    )
    .option(
      "-i, --node-id <id>",
      'The ID of the node in the Figma document, eg. "123:456" or "123-456"',
    )
    .option(
      "-c, --content-only",
      "Save only the first text content (XML), not the full JSON response",
    )
    .option(
      "-l, --client-languages <languages>",
      "A comma separated list of programming languages used by the client in the current context",
    )
    .option(
      "-f, --client-frameworks <frameworks>",
      "A comma separated list of frameworks used by the client in the current context",
    )
    .option(
      "--force",
      "Allow writing outside the current working directory. Do not use unless explicitly permitted by the user.",
    )
    .action(async (outputFile: string, options: Options) => {
      const nodeId = options.nodeId;
      const { client, transport } = await createMcpClient("metadata");

      try {
        console.log(
          `\n📋 Getting metadata for Node ID: ${nodeId || "(selected)"}...`,
        );

        const result = await client.callTool({
          name: "get_metadata",
          arguments: {
            ...(nodeId && { nodeId: nodeId }),
            ...(options.clientLanguages && {
              clientLanguages: options.clientLanguages,
            }),
            ...(options.clientFrameworks && {
              clientFrameworks: options.clientFrameworks,
            }),
          },
        });

        saveResult(
          result as ToolResult,
          outputFile,
          options.contentOnly ?? false,
          nodeId || "(selected)",
          options.force ?? false,
        );
      } catch (error) {
        handleError(error);
      } finally {
        await closeMcpTransport(transport);
      }
    });
}
