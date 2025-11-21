interface Candle {
  time: number
  close: number
}

export function calcEMA(candles: Candle[], period: number) {
  if (candles.length < period) return []

  const k = 2 / (period + 1)
  const emaData: { time: number; value: number }[] = []

  let ema = candles.slice(0, period).reduce((sum, c) => sum + c.close, 0) / period
  emaData.push({ time: candles[period - 1].time, value: ema })

  for (let i = period; i < candles.length; i++) {
    ema = candles[i].close * k + ema * (1 - k)
    emaData.push({ time: candles[i].time, value: ema })
  }

  return emaData
}
