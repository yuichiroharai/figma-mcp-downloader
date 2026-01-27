import { Command } from "commander";
import { ToolResult } from "./types.js";
import {
  addCommonOptions,
  closeMcpTransport,
  CommonOptions,
  createMcpClient,
  handleError,
  saveResult,
} from "./utils.js";

export function registerGetMetadataCommand(program: Command): void {
  addCommonOptions(
    program
      .command("get_metadata")
      .description(
        "Get the sparse XML representation for a layer or selection and save the full JSON response from the MCP tool to a file",
      )
      .argument(
        "<output-file>",
        "Output file path, e.g., metadata.xml, metadata.json",
      ),
  ).action(async (outputFile: string, options: CommonOptions) => {
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
