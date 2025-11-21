export function calculateEMA(data: number[], period: number): (number | null)[] {
  const ema: (number | null)[] = []
  const multiplier = 2 / (period + 1)

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      ema.push(null)
    } else if (i === period - 1) {
      const sum = data.slice(0, period).reduce((a, b) => a + b, 0)
      ema.push(sum / period)
    } else {
      const prevEma = ema[i - 1] as number
      ema.push((data[i] - prevEma) * multiplier + prevEma)
    }
  }

  return ema
}

export function calculateRSI(data: number[], period: number = 14): (number | null)[] {
  const rsi: (number | null)[] = []
  const gains: number[] = []
  const losses: number[] = []

  for (let i = 1; i < data.length; i++) {
    const change = data[i] - data[i - 1]
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? -change : 0)
  }

  // First period + 1 values are null (warmup period)
  for (let i = 0; i <= period; i++) {
    rsi.push(null)
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    rsi.push(100 - 100 / (1 + rs))
  }

  return rsi
}

export function calculateMACD(data: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
  const fastEMA = calculateEMA(data, fastPeriod)
  const slowEMA = calculateEMA(data, slowPeriod)
  
  const macdLine = fastEMA.map((fast, i) => {
    const slow = slowEMA[i]
    return fast !== null && slow !== null ? fast - slow : null
  })

  const macdValues = macdLine.map(v => v === null ? 0 : v)
  const signalEMA = calculateEMA(macdValues, signalPeriod)
  
  // Convert signal EMA back to null where MACD was null
  const signalLine = signalEMA.map((signal, i) => 
    macdLine[i] === null ? null : signal
  )

  const histogram = macdLine.map((macd, i) => {
    const signal = signalLine[i]
    return macd !== null && signal !== null ? macd - signal : null
  })

  return { macdLine, signalLine, histogram }
}

export function calculateVWAP(candleData: any[]): number[] {
  const vwap: number[] = []
  let cumulativeTPV = 0
  let cumulativeVolume = 0

  for (const candle of candleData) {
    const typicalPrice = (candle.high + candle.low + candle.close) / 3
    cumulativeTPV += typicalPrice * candle.volume
    cumulativeVolume += candle.volume
    vwap.push(cumulativeTPV / cumulativeVolume)
  }

  return vwap
}

export function calculateATR(candleData: any[], period: number = 14): number[] {
  const atr: number[] = []
  const trueRanges: number[] = []

  for (let i = 1; i < candleData.length; i++) {
    const high = candleData[i].high
    const low = candleData[i].low
    const prevClose = candleData[i - 1].close

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    )
    trueRanges.push(tr)
  }

  for (let i = 0; i < period - 1; i++) {
    atr.push(0)
  }

  let atrValue = trueRanges.slice(0, period).reduce((a, b) => a + b, 0) / period
  atr.push(atrValue)

  for (let i = period; i < trueRanges.length; i++) {
    atrValue = (atrValue * (period - 1) + trueRanges[i]) / period
    atr.push(atrValue)
  }

  return atr
}
