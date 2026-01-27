#!/usr/bin/env node
import { Command } from "commander";
import { registerGetDesignContextCommand } from "./get_design_context.js";
import { registerGetMetadataCommand } from "./get_metadata.js";
import { VERSION } from "./utils.js";

const program = new Command();

program
  .name("figma-mcp-downloader")
  .description("CLI for saving Figma MCP tool results to local files")
  .version(VERSION);

registerGetDesignContextCommand(program);
registerGetMetadataCommand(program);

program.parse();
