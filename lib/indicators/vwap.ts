interface Candle {
  time: number
  high: number
  low: number
  close: number
  volume: number
}

export function calcVWAP(candles: Candle[]) {
  const vwapData: { time: number; value: number }[] = []
  
  let cumulativeTPV = 0
  let cumulativeVolume = 0

  for (const c of candles) {
    const typicalPrice = (c.high + c.low + c.close) / 3
    cumulativeTPV += typicalPrice * c.volume
    cumulativeVolume += c.volume

    const vwap = cumulativeVolume === 0 ? typicalPrice : cumulativeTPV / cumulativeVolume

    vwapData.push({ time: c.time, value: vwap })
  }

  return vwapData
}
