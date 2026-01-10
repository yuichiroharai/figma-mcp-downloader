import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
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
): boolean {
  const savePath = path.resolve(process.cwd(), outputFile);
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
