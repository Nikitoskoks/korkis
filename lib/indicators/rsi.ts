interface Candle {
  time: number
  close: number
}

export function calcRSI(candles: Candle[], period = 14) {
  if (candles.length < period + 1) return []

  const changes: number[] = []
  for (let i = 1; i < candles.length; i++) {
    changes.push(candles[i].close - candles[i - 1].close)
  }

  const rsiData: { time: number; value: number }[] = []

  for (let i = period; i <= changes.length; i++) {
    const slice = changes.slice(i - period, i)
    const gains = slice.filter(c => c > 0).reduce((sum, c) => sum + c, 0)
    const losses = Math.abs(slice.filter(c => c < 0).reduce((sum, c) => sum + c, 0))

    const avgGain = gains / period
    const avgLoss = losses / period

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))

    rsiData.push({ time: candles[i].time, value: rsi })
  }

  return rsiData
}
