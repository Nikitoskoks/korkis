interface Candle {
  time: number
  close: number
}

function calcEMAForMACD(values: number[], period: number): number[] {
  const k = 2 / (period + 1)
  const ema: number[] = []
  
  let sum = 0
  for (let i = 0; i < period && i < values.length; i++) {
    sum += values[i]
  }
  ema.push(sum / period)

  for (let i = period; i < values.length; i++) {
    ema.push(values[i] * k + ema[ema.length - 1] * (1 - k))
  }

  return ema
}

export function calcMACD(candles: Candle[]) {
  const closes = candles.map(c => c.close)
  
  const ema12 = calcEMAForMACD(closes, 12)
  const ema26 = calcEMAForMACD(closes, 26)

  const macdLine: { time: number; value: number }[] = []
  const startIdx = Math.max(0, 26 - 12)

  for (let i = startIdx; i < ema12.length && i < ema26.length; i++) {
    macdLine.push({
      time: candles[i + 12 - 1].time,
      value: ema12[i] - ema26[i]
    })
  }

  const macdValues = macdLine.map(m => m.value)
  const signalEMA = calcEMAForMACD(macdValues, 9)

  const signal: { time: number; value: number }[] = []
  const hist: { time: number; value: number; color: string }[] = []

  for (let i = 0; i < signalEMA.length; i++) {
    const time = macdLine[i].time
    const macdVal = macdLine[i].value
    const sigVal = signalEMA[i]

    signal.push({ time, value: sigVal })
    
    const histValue = macdVal - sigVal
    hist.push({
      time,
      value: histValue,
      color: histValue >= 0 ? '#22c55e' : '#ef4444'
    })
  }

  return { line: macdLine, signal, hist }
}
