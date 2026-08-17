# Integration of Model Context Protocol (MCP)

To enable external data retrieval and tool-assisted learning, we will implement a server-side MCP client layer. This allows the application's AI to interact with external tools (like search engines, documentation hubs, or university databases) using a standardized protocol.

## Proposed Changes

### Backend (Server-Side)
- **MCP Client Core:** Create `src/lib/mcp.server.ts` to manage connections to MCP servers (via HTTP or stdio stubs for edge compatibility).
- **Tool Registry:** Implement a handler to discovery and call MCP tools from server functions.
- **Enhanced Analysis:** Update `src/lib/study.server.ts` to optionally use MCP tools (e.g., `google-search` for Tamil tutorial links or latest Anna University syllabus updates) instead of relying solely on internal weights.

### Frontend
- **MCP Status Indicator:** Add a subtle "Tool Assisted" badge to the AI analysis results.
- **Agentic Chat (Optional/Future):** Add a toggle in the Dashboard to allow the AI to "browse" for better explanations.

## Technical Details
- **Architecture:** We will use a fetch-based MCP client to interact with remote MCP servers, as direct `stdio` transport is restricted in the serverless Worker runtime.
- **Library:** Use `@modelcontextprotocol/sdk` (if compatible with workers) or a custom lightweight implementation.
- **Security:** Ensure MCP tool calls are proxied through server functions and audited for data leakage.

```typescript
// Example src/lib/mcp.server.ts structure
export async function callMcpTool(serverUrl: string, toolName: string, args: any) {
  // Implementation of MCP Tool call over HTTP
}
```
