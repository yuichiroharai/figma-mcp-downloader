#!/usr/bin/env node
import { Command } from "commander";
import { registerGetDesignContextCommand } from "./get_design_context.js";
import { registerGetMetadataCommand } from "./get_metadata.js";

const program = new Command();

program
  .name("figma-mcp-downloader")
  .description("CLI tool to download design data from Figma MCP Server")
  .version("0.1.0");

registerGetDesignContextCommand(program);
registerGetMetadataCommand(program);

program.parse();
