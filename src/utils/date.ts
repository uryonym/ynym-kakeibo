// 日付フォーマットユーティリティ
// ここでは必要最小限のフォーマット関数を提供する
export function formatYMDSlash(d: Date) {
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

export function formatYYYYMM(yyyy: number, mm: number) {
  return `${yyyy}-${String(mm).padStart(2, '0')}`
}

// デフォルトエクスポートは使わず、名前付きエクスポートのみを提供します
