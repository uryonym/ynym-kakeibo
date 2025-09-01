// 数値を日本円表記に整形するユーティリティ
// 他のコンポーネントやページで共通利用するため切り出す
export function formatYen(n: number) {
  return n.toLocaleString('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  })
}
