<!--
Sync Impact Report
- Version change: (none) -> 1.0.0
-- Modified principles:
    - PRINCIPLE_1_NAME -> I. Privacy-First Data Minimalism
    - PRINCIPLE_2_NAME -> II. Spec-First Development (Spec-Kit)
    - PRINCIPLE_3_NAME -> III. Test-First (TDD, NON-NEGOTIABLE)
    - PRINCIPLE_4_NAME -> IV. Contract & Integration Testing
    - PRINCIPLE_5_NAME -> V. Observability & Simplicity
- Added sections:
	- Technology Stack & Constraints
	- Development Workflow & Quality Gates
- Removed sections: none (template sections retained and filled)
-- Templates requiring updates:
	- .specify/templates/plan-template.md ✅ reviewed — references Constitution Check (aligns with Spec-First and Test-First principles)
	- .specify/templates/spec-template.md ✅ reviewed — mandatory sections align with testable requirements
	- .specify/templates/tasks-template.md ✅ reviewed — task categories match new principles (Tests-first, Contracts)
-- Deferred items / TODOs:
	- RATIFICATION_DATE: TODO(RATIFICATION_DATE): 初回採択日をチームで決定してください
	- Confirm exact DB / external service choices in future specs (not yet defined here)
-- End Sync Impact Report
-->

# ynym-kakeibo Constitution

## Core Principles

### I. Privacy-First Data Minimalism

ユーザーデータは最小限に収集・保存し、保存が必須なデータは適切に暗号化する。ログに個人識別情報を残さず、解析には匿名化/集約を用いる。データ保持期間は機能仕様で定義し、不要になったデータは速やかに削除する。

### II. Spec-First Development (Spec-Kit)

すべての機能は事前に仕様（spec-kit テンプレート）として定義する。仕様から契約テスト・タスクを生成し、テストが先に存在する状態で実装を進める。仕様は `specs/` 以下に格納し、変更はレビューを経てマージすること。

### III. Test-First (TDD, NON-NEGOTIABLE)

単体テスト・契約テスト・統合テストを先に作成し、テストが失敗することを確認してから実装を開始する（Red-Green-Refactor）。CI に合格することをマージの必須条件とする。

### IV. Contract & Integration Testing

バックエンドとフロントエンドは API を通じて疎結合で連携するため、OpenAPI 等の契約仕様を定義し、契約テストで互換性を自動検証する。契約変更は互換性影響を明示し、移行計画を作成する。

### V. Observability & Simplicity

設計は可能な限りシンプルに保ち、トレーサビリティのために構造化ログ・メトリクスを実装する。可観測性は本番の運用を前提とした設計要件とし、重大なユーザー操作はメトリクス化する。

## Technology Stack & Constraints

フロントエンド: `frontend` ディレクトリ (Next.js, TypeScript)

バックエンド: `backend` ディレクトリ (Python, FastAPI)。パッケージ管理は `uv` を使用する構成を想定する。フロントとバックは API 経由で通信し、データストア・外部サービスの選定は各仕様で明示する。

## Development Workflow & Quality Gates

Branching: feature/\* を使い、`main` ブランチは常にデプロイ可能とする。Pull Request は最低 1 名のレビュワー承認と CI（lint / 型チェック / テスト）の成功が必要。マージ前に契約テストと統合テストの結果を確認すること。

品質ゲート: ESLint/TypeScript 型チェック（frontend）、flake8/ruff と型チェック（backend）、ユニットテスト、契約テスト、統合テストを必須とする。依存関係の脆弱性スキャンは週次で実施する。

## Governance

本憲法はプロジェクトの開発原則を定める根本文書であり、運用または設計の指針が本憲法と矛盾する場合は本憲法が優先する。改定は以下を満たすこと:

- 提案された改定は ADR（Architecture Decision Record）として記録する。\
- 最低 2 名のチームリードによるレビューと承認を必要とする。\
- 互換性に影響する変更は移行計画を添付し、影響範囲をテストで示す。

例外: 明確な理由があり一時的に憲法の要件を逸脱する場合は、例外 ADR を作成し、期限と回避策を明示のうえ 2 名の承認を得ること。

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): 初回採択日をチームで決定してください | **Last Amended**: 2025-10-04
