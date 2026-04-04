import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GenerateUuidsInput } from "./schemas/generate.js";
import { ParseUuidsInput } from "./schemas/parse.js";
import { ValidateUuidsInput } from "./schemas/validate.js";
import { generateUuids } from "./tools/generate.js";
import { parseUuids } from "./tools/parse.js";
import { validateUuids } from "./tools/validate.js";

const server = new McpServer({
  name: "uuid-mcp",
  version: "0.1.0",
});

server.registerTool(
  "generate_uuids",
  {
    description: "UUID v7 を生成する",
    inputSchema: GenerateUuidsInput,
  },
  (input) => {
    const result = generateUuids(input);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  },
);

server.registerTool(
  "validate_uuids",
  {
    description: "UUID の形式チェックを行う",
    inputSchema: ValidateUuidsInput,
  },
  (input) => {
    const result = validateUuids(input);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  },
);

server.registerTool(
  "parse_uuids",
  {
    description: "UUID v7 からタイムスタンプ等を抽出する",
    inputSchema: ParseUuidsInput,
  },
  (input) => {
    const result = parseUuids(input);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
