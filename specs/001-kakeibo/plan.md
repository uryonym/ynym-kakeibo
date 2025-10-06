# 実装計画: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**入力**: `/specs/[###-feature-name]/spec.md` からの機能仕様

## 実行フロー（/plan コマンドの範囲）

```
1.  入力パスから機能仕様を読み込む
    → 見つからない場合: ERROR "No feature spec at {path}"
2.  技術コンテキストを埋める（NEEDS CLARIFICATION を検出）
    → ファイル構成やコンテキストからプロジェクトタイプを判定（web = frontend+backend、mobile = app+api 等）
    → プロジェクトタイプに基づく構成決定を行う
3.  憲法チェックのセクションを憲法ドキュメントの内容に基づいて埋める
4.  下の憲法チェックを評価する
    → 違反がある場合: Complexity Tracking に記録する
    → 正当化できない場合: ERROR "Simplify approach first"
    → 進捗トラックを更新: Initial Constitution Check
5.  フェーズ 0 を実行 → research.md を生成
    → まだ NEEDS CLARIFICATION が残る場合: ERROR "Resolve unknowns"
6.  フェーズ 1 を実行 → contracts, data-model.md, quickstart.md, およびエージェント固有テンプレートファイル（例: `CLAUDE.md`, `.github/copilot-instructions.md`, `GEMINI.md`, `QWEN.md`, `AGENTS.md` など）を生成
7.  憲法チェックを再評価する
    → 新たな違反があれば設計をリファクタしてフェーズ 1 に戻る
    → 進捗トラックを更新: Post-Design Constitution Check
8.  フェーズ 2 を計画する → タスク生成の方針を記述（この段階では `tasks.md` は作成しない）
9.  停止 - /tasks コマンドの準備完了
```

**重要**: /plan コマンドはステップ 7 で停止します。フェーズ 2〜4 は別コマンドで実行されます:

- フェーズ 2: `/tasks` コマンドが `tasks.md` を作成します
- フェーズ 3〜4: 実装の実行（手動またはツールによる）

## サマリ

[機能仕様から抽出: 主要要件 + research による技術的アプローチ]

## 技術コンテキスト

**言語/バージョン**: [例: Python 3.11, Swift 5.9, Rust 1.75 または NEEDS CLARIFICATION]
**主要依存**: [例: FastAPI, UIKit, LLVM または NEEDS CLARIFICATION]
**ストレージ**: [該当する場合: PostgreSQL, CoreData, ファイル など または N/A]
**テスト**: [例: pytest, XCTest, cargo test または NEEDS CLARIFICATION]
**ターゲットプラットフォーム**: [例: Linux server, iOS 15+, WASM または NEEDS CLARIFICATION]
**プロジェクトタイプ**: [single/web/mobile - ソース構成を決定]
**パフォーマンス目標**: [ドメイン固有、例: 1000 req/s, 60 fps または NEEDS CLARIFICATION]
**制約**: [ドメイン固有、例: <200ms p95, <100MB メモリ, オフライン対応 等 または NEEDS CLARIFICATION]
**規模/範囲**: [ドメイン固有、例: 10k ユーザー, 1M LOC, 50 画面 または NEEDS CLARIFICATION]

## 憲法チェック

_GATE: フェーズ 0（research）前に必須。フェーズ 1（設計）後に再チェックする。_

[憲法ファイルに基づいてゲート条件をここに記載]

## プロジェクト構成

### ドキュメント（この機能）

```
specs/[###-feature]/
├── plan.md # このファイル（/plan コマンド出力）
├── research.md # フェーズ 0 の出力（/plan コマンド）
├── data-model.md # フェーズ 1 の出力（/plan コマンド）
├── quickstart.md # フェーズ 1 の出力（/plan コマンド）
├── contracts/ # フェーズ 1 の出力（/plan コマンド）
└── tasks.md # フェーズ 2 の出力（/tasks コマンド - /plan では作成しない）
```

### ソースコード（リポジトリルート）

<!--
  アクション: 下記のプレースホルダツリーをこの機能に合った実際のレイアウトで置き換えてください。
  不要なオプションは削除し、選択した構成を実際のパスで展開してください（例: apps/admin, packages/...）。
  提出する計画にオプションラベルを残さないこと。
-->

# 例: 単一プロジェクト構成

```
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/
```

# 例: Web アプリケーション構成（frontend + backend が検出された場合）

```
backend/
├── src/
│ ├── models/
│ ├── services/
│ └── api/
└── tests/

frontend/
├── src/
│ ├── components/
│ ├── pages/
│ └── services/
└── tests/
```

# 例: モバイル + API 構成（iOS/Android が検出された場合）

```
api/
└── [backend と同様]

ios/ or android/
└── [プラットフォーム固有: 機能モジュール、UI フロー、プラットフォームテスト]
```

**構成決定**: [選択した構成と上で示した実際のディレクトリを記載]

## フェーズ 0: 概要と調査

1. **技術コンテキストの不明点（NEEDS CLARIFICATION）を抽出**:

   - 各 NEEDS CLARIFICATION → 調査タスク
   - 各依存 → ベストプラクティス調査タスク
   - 各統合 → パターン調査タスク

2. **調査エージェントを生成・割当**:

```
各技術的不明点について:
タスク: "{feature context} における {unknown} の調査"
各技術選択について:
タスク: "{domain} における {tech} のベストプラクティスを調査"
```

3. **調査結果を `research.md` に統合**（フォーマット）:
   - Decision: [採用した案]
   - Rationale: [採用理由]
   - Alternatives considered: [検討した代替案]

**出力**: 全ての NEEDS CLARIFICATION が解決された `research.md`

## フェーズ 1: 設計と契約

_前提: research.md 完了_

1. **機能仕様からエンティティを抽出** → `data-model.md`:

   - エンティティ名、フィールド、リレーション
   - 要件に基づくバリデーションルール
   - 状態遷移（該当する場合）

2. **機能要件から API 契約を生成**:

   - 各ユーザー操作 → エンドポイント
   - 標準的な REST/GraphQL パターンを使用
   - OpenAPI/GraphQL スキーマを `/contracts/` に出力

3. **契約から契約テストを生成**:

   - エンドポイントごとにテストファイルを 1 つ作成
   - リクエスト/レスポンスのスキーマを検証
   - 実装がない段階で失敗することを前提とする

4. **ユーザーストーリーからテストシナリオを抽出**:

   - 各ストーリー → 統合テストシナリオ
   - Quickstart テスト = ストーリー検証手順

5. **エージェント用ファイルを段階的に更新（O(1) 操作）**:
   - `.specify/scripts/bash/update-agent-context.sh copilot` を実行
     **重要**: 上記コマンドを正確に実行してください。引数の追加・削除は行わないでください。
   - 既存なら現在のプランに追加された新しい技術のみを追加
   - マーカー間の手動追加は保持
   - 直近の変更を更新（直近 3 件を保持）
   - トークン効率のため 150 行以下に抑える
   - 出力はリポジトリルートへ

**出力**: `data-model.md`, `/contracts/*`, 失敗するテスト群, `quickstart.md`, エージェント固有ファイル

## フェーズ 2: タスク計画の方針

_このセクションは `/tasks` コマンドが何をするかを示す（/plan 実行中は実行しない）_

**タスク生成戦略**:

- `.specify/templates/tasks-template.md` をベースに読み込む
- フェーズ 1 の設計ドキュメント（contracts, data model, quickstart）からタスクを生成
- 各契約 → 契約テストタスク [P]
- 各エンティティ → モデル作成タスク [P]
- 各ユーザーストーリー → 統合テストタスク
- テストを通すための実装タスク

**並び順戦略**:

- TDD 順序: テストを先に作成してから実装
- 依存順: モデル → サービス → UI
- 独立可能なファイルは [P] を付け並列実行を想定

**想定出力**: `tasks.md` に 25-30 の番号付きタスクを出力

**重要**: このフェーズは `/tasks` コマンドによって実行され、/plan では実行しない

## フェーズ 3+: 将来の実装フェーズ

_これらは /plan コマンドの範囲外です_

**フェーズ 3**: タスク実行（/tasks が tasks.md を作成）
**フェーズ 4**: 実装（tasks.md に従って実行）
**フェーズ 5**: 検証（テスト実行、quickstart.md の手順を実行、性能検証）

## 複雑性トラッキング

_憲法チェックに違反があり正当化が必要な場合のみ記載する_

| Violation                  | Why Needed       | Simpler Alternative Rejected Because |
| -------------------------- | ---------------- | ------------------------------------ |
| [例: 複数プロジェクト構成] | [現在の必要性]   | [なぜ単純化が不適切か]               |
| [例: Repository パターン]  | [具体的な問題点] | [なぜ直接 DB アクセスでは不十分か]   |

## 進捗トラッキング

_このチェックリストは実行フローの間に更新される_

**フェーズ状態**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**ゲート状態**:

- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_憲法 v2.1.1 に基づく - `/memory/constitution.md` を参照_
