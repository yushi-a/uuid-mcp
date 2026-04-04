# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UUID v7 の生成・検証・解析を行う MCP (Model Context Protocol) サーバ。
`npx uuid-mcp` で起動できる形式で npm に公開することを想定している。

## Commands

```bash
# 依存インストール
npm install

# ビルド (dist/ に出力)
npm run build

# 開発時ウォッチビルド
npm run dev

# Lint + フォーマットチェック (biome)
npm run check

# Lint + フォーマット自動修正
npm run check:fix

# 型チェックのみ (コンパイルなし)
npm run typecheck

# テスト実行
npm test

# テストウォッチモード
npm run test:watch
```

単一テストファイルを指定して実行:

```bash
npx vitest run src/tools/generate.test.ts
```

## Architecture

```
src/
├── index.ts              # エントリポイント。MCPサーバの起動・ツール登録
├── schemas/              # Zod スキーマ = 仕様の唯一の真実の源泉
│   ├── generate.ts       # generate_uuid の入出力スキーマ
│   ├── validate.ts       # validate_uuid の入出力スキーマ
│   └── parse.ts          # parse_uuid の入出力スキーマ
└── tools/                # 各ツールの実装とテスト
    ├── generate.ts
    ├── generate.test.ts
    ├── validate.ts
    ├── validate.test.ts
    ├── parse.ts
    └── parse.test.ts

docs/
└── decisions/            # コードに表れない設計判断のみ記録 (ADR)
```

### 開発フロー (Schema-First)

仕様は Zod スキーマで表現する。Markdown の仕様書は作らない。

```
1. src/schemas/xxx.ts にスキーマを書く（= 仕様定義）
2. src/tools/xxx.test.ts にテストを書く
3. src/tools/xxx.ts を実装してテストを通す
```

スキーマには `.describe()` で説明を付け、コードを自己文書化する:

```typescript
export const GenerateUuidInput = z.object({
  count: z.number().int().min(1).max(100).default(1)
    .describe("生成するUUIDの個数 (1〜100)"),
});
export type GenerateUuidInput = z.infer<typeof GenerateUuidInput>;
```

### MCP Tools

| ツール名 | 機能 |
|---------|------|
| `generate_uuid` | UUID v7 を生成。`count` 引数で一括生成 (デフォルト: 1) |
| `validate_uuid` | UUID の形式チェック (正規表現) |
| `parse_uuid` | UUID v7 からタイムスタンプ等を抽出 |

### 技術スタック

| 用途 | ツール |
|------|--------|
| MCP フレームワーク | `@modelcontextprotocol/sdk` |
| スキーマ / バリデーション | `zod` |
| UUID 生成 | `uuid` パッケージ (v11+) |
| ビルド | `tsup` (esbuild ベース、ESM 出力) |
| Lint / フォーマット | `Biome` (ESLint + Prettier の代替、単一ツール) |
| テスト | `Vitest` |
| 型チェック | `TypeScript` (strict モード) |

### Transport

MCP サーバは **stdio transport** で動作する。
Claude Desktop 等のクライアントから以下の設定で利用できる:

```json
{
  "mcpServers": {
    "uuid": {
      "command": "npx",
      "args": ["-y", "uuid-mcp"]
    }
  }
}
```

## Notes

- `"type": "module"` (ESM) で統一。`import` 文の拡張子は `.js` を使う (TypeScript の NodeNext 慣習)
- `tsup` のビルド出力に `#!/usr/bin/env node` が自動付与されるため、`chmod +x` は不要
- テストファイルは `src/tools/*.test.ts` に配置する
