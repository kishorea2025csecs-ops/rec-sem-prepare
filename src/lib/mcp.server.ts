/**
 * MCP Client Implementation for TanStack Start (Worker Runtime)
 * 
 * Since we run in a Cloudflare Worker-like runtime, we use HTTP transport
 * for interacting with MCP servers.
 */

export interface McpTool {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
}

export interface McpCallResult {
  content: Array<{
    type: string;
    text?: string;
    [key: string]: unknown;
  }>;
  isError?: boolean;
}

/**
 * Executes a tool call on a remote MCP server via HTTP.
 */
export async function callMcpTool(
  serverUrl: string,
  toolName: string,
  args: Record<string, unknown>,
  apiKey?: string
): Promise<McpCallResult> {
  const endpoint = `${serverUrl.replace(/\/$/, '')}/tools/call`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      name: toolName,
      arguments: args,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MCP Tool call failed (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<McpCallResult>;
}

/**
 * Lists available tools from a remote MCP server.
 */
export async function listMcpTools(
  serverUrl: string,
  apiKey?: string
): Promise<McpTool[]> {
  const endpoint = `${serverUrl.replace(/\/$/, '')}/tools/list`;
  
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`MCP Tool listing failed (${response.status})`);
  }

  const data = await response.json() as { tools: McpTool[] };
  return data.tools || [];
}
