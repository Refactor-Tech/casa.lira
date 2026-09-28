const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatPrice(cents: number): string {
  return currency.format(cents / 100)
}

export function priceToInput(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',')
}

export function parsePriceInput(raw: string): number | null {
  const text = raw.trim().replace(/^R\$\s*/, '')
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(text)) return null
  const [whole = '', decimals = ''] = text.replaceAll('.', '').split(',')
  const cents = Number(whole) * 100 + Number(decimals.padEnd(2, '0'))
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null
}
