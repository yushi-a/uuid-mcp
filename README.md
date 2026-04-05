# uuid-mcp

UUID v7 の生成・検証・解析を行う MCP (Model Context Protocol) サーバ。

## Tools

| ツール名 | 説明 |
|---------|------|
| `generate_uuids` | UUID v7 を生成する。`count` で一括生成も可能 (最大100件) |
| `validate_uuids` | UUID の形式チェックを行う |
| `parse_uuids` | UUID v7 からタイムスタンプ等を抽出する |

## Usage

### Claude Desktop

`claude_desktop_config.json` に以下を追加:

```json
{
  "mcpServers": {
    "uuid": {
      "command": "npx",
      "args": ["-y", "@yushi-a/uuid-mcp"]
    }
  }
}
```

### その他の MCP クライアント

stdio transport 対応のクライアントであれば同様に利用できる。

## Requirements

- Node.js 20+

## Development

```bash
npm install
npm run build   # ビルド
npm test        # テスト
npm run check   # Lint + フォーマットチェック
```

## License

[MIT](./LICENSE)
