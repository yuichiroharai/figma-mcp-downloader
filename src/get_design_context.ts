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

const VALID_ARTIFACT_TYPES = [
  "WEB_PAGE_OR_APP_SCREEN",
  "COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN",
  "REUSABLE_COMPONENT",
  "DESIGN_SYSTEM",
] as const;

const VALID_TASK_TYPES = [
  "CREATE_ARTIFACT",
  "CHANGE_ARTIFACT",
  "DELETE_ARTIFACT",
] as const;

type ArtifactType = (typeof VALID_ARTIFACT_TYPES)[number];
type TaskType = (typeof VALID_TASK_TYPES)[number];

interface Options extends CommonOptions {
  artifactType?: string;
  taskType?: string;
}

export function registerGetDesignContextCommand(program: Command): void {
  addCommonOptions(
    program
      .command("get_design_context")
      .description(
        "Get the design context for a layer or selection and save the full JSON response from the MCP tool to a file.",
      )
      .argument(
        "<output-file>",
        "Output file path, e.g., design_context.jsx, design_context.json",
      )
      .option(
        "-a, --artifact-type <type>",
        `The type of artifact the user is creating or modifying. Valid values: ${VALID_ARTIFACT_TYPES.join(", ")}`,
      )
      .option(
        "-t, --task-type <type>",
        `The type of task being performed. Valid values: ${VALID_TASK_TYPES.join(", ")}`,
      ),
  ).action(async (outputFile: string, options: Options) => {
    const nodeId = options.nodeId;
    // Validate artifactType
    if (
      options.artifactType &&
      !VALID_ARTIFACT_TYPES.includes(options.artifactType as ArtifactType)
    ) {
      console.error(`❌ Error: Invalid artifact type: ${options.artifactType}`);
      console.log("\nValid artifact types:");
      VALID_ARTIFACT_TYPES.forEach((type) => console.log(`  - ${type}`));
      process.exit(1);
    }

    // Validate taskType
    if (
      options.taskType &&
      !VALID_TASK_TYPES.includes(options.taskType as TaskType)
    ) {
      console.error(`❌ Error: Invalid task type: ${options.taskType}`);
      console.log("\nValid task types:");
      VALID_TASK_TYPES.forEach((type) => console.log(`  - ${type}`));
      process.exit(1);
    }

    const { client, transport } = await createMcpClient("design-context");

    try {
      console.log(
        `\n🎨 Getting design context for Node ID: ${nodeId || "(selected)"}...`,
      );

      const result = await client.callTool({
        name: "get_design_context",
        arguments: {
          nodeId: nodeId,
          forceCode: true,
          ...(options.artifactType && {
            artifactType: options.artifactType,
          }),
          ...(options.taskType && { taskType: options.taskType }),
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
