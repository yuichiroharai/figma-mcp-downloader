import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { ToolResult } from "./types.js";

// Requires Figma desktop app to be running
// Can be overridden with FIGMA_MCP_URL environment variable
export const FIGMA_MCP_URL =
  process.env.FIGMA_MCP_URL || "http://127.0.0.1:3845/mcp";

export async function createMcpClient(
  scriptName: string,
): Promise<{ client: Client; transport: StreamableHTTPClientTransport }> {
  const transport = new StreamableHTTPClientTransport(new URL(FIGMA_MCP_URL));
  const client = new Client(
    { name: `${scriptName}-script`, version: "1.0.0" },
    { capabilities: {} },
  );

  console.log("🔌 Connecting to Figma MCP Server...");
  await client.connect(transport);
  console.log("✅ Connected!");

  return { client, transport };
}

export async function closeMcpTransport(
  transport: StreamableHTTPClientTransport,
): Promise<void> {
  try {
    await transport.close();
    console.log("\n🔌 Disconnected from server");
  } catch {
    // Ignore close errors
  }
}

export function saveResult(
  result: ToolResult,
  outputFile: string,
  contentOnly: boolean,
  nodeIdLabel: string,
  force: boolean = false,
): boolean {
  const savePath = path.resolve(process.cwd(), outputFile);
  const cwd = process.cwd();

  // Prevent path traversal attacks: ensure savePath is within cwd
  // Skip check if --force is used
  if (!force) {
    const relativePath = path.relative(cwd, savePath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      console.error(
        `❌ Error: Output path must be within the current working directory.`,
      );
      console.error(`   Attempted path: ${savePath}`);
      console.error(`   Current directory: ${cwd}`);
      console.error(
        `   Use --force to bypass this check only if explicitly permitted by the user.`,
      );
      process.exitCode = 1;
      return false;
    }
  }

  const dir = path.dirname(savePath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let saved = false;

  if (contentOnly) {
    // --content-only: Find the first type="text" item in the array and save it
    for (const item of result.content) {
      if (item.type === "text" && item.text) {
        fs.writeFileSync(savePath, item.text, "utf-8");
        console.log(`💾 Saved: ${savePath}`);
        saved = true;
        break;
      }
    }
    if (!saved) {
      console.warn(`⚠️  No text data returned for ${nodeIdLabel}`);
      process.exitCode = 1;
    }
  } else {
    // Default: Save the full JSON response
    fs.writeFileSync(savePath, JSON.stringify(result, null, 2), "utf-8");
    console.log(`💾 Saved: ${savePath}`);
    saved = true;
  }

  return saved;
}

export function handleError(error: unknown): void {
  console.error("❌ Error:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}

export interface CommonOptions {
  nodeId?: string;
  clientLanguages?: string;
  clientFrameworks?: string;
  contentOnly?: boolean;
  force?: boolean;
}

/**
 * 共通オプションをコマンドに追加する
 */
export function addCommonOptions(command: Command): Command {
  return command
    .option(
      "-i, --node-id <id>",
      'The ID of the node in the Figma document, eg. "123:456" or "123-456"',
    )
    .option(
      "-c, --content-only",
      "Save only the first text content, not the full JSON response",
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
    );
}
