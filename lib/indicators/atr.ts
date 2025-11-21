interface Candle {
  time: number
  high: number
  low: number
  close: number
}

export function calcATR(candles: Candle[], period = 14) {
  if (candles.length < period + 1) return []

  const trueRanges: number[] = []

  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high
    const low = candles[i].low
    const prevClose = candles[i - 1].close

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    )

    trueRanges.push(tr)
  }

  const atrData: { time: number; value: number }[] = []

  let atr = trueRanges.slice(0, period).reduce((sum, tr) => sum + tr, 0) / period
  atrData.push({ time: candles[period].time, value: atr })

  for (let i = period; i < trueRanges.length; i++) {
    atr = (atr * (period - 1) + trueRanges[i]) / period
    atrData.push({ time: candles[i + 1].time, value: atr })
  }

  return atrData
}
