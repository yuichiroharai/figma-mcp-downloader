#!/usr/bin/env node
import { Command } from "commander";
import { registerGetDesignContextCommand } from "./get_design_context.js";
import { registerGetMetadataCommand } from "./get_metadata.js";

const program = new Command();

program
  .name("figma-mcp-downloader")
  .description("CLI for saving Figma MCP tool results to local files.")
  .version("1.0.0");

registerGetDesignContextCommand(program);
registerGetMetadataCommand(program);

program.parse();
