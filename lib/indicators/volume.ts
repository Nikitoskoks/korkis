interface Candle {
  time: number
  open: number
  close: number
  volume: number
}

export function calcVolumeList(candles: Candle[]) {
  return candles.map(c => ({
    time: c.time,
    value: c.volume,
    color: c.close >= c.open ? '#22c55e80' : '#ef444480'
  }))
}

export function calcVolumePoint(candle: Candle) {
  return {
    time: candle.time,
    value: candle.volume,
    color: candle.close >= candle.open ? '#22c55e80' : '#ef444480'
  }
}
