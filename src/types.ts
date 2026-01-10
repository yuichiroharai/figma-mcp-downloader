// MCP content item type
export interface ContentItem {
  type: string;
  text?: string;
}

// MCP callTool result type
export interface ToolResult {
  content: ContentItem[];
}
