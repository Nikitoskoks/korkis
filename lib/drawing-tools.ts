export type DrawingTool =
  | "cursor"
  | "trend-line"
  | "parallel-channel"
  | "fibonacci"
  | "gann-fan"
  | "gann-box"
  | "fibonacci-ext"
  | "fibonacci-arc"
  | "rectangle"
  | "circle"
  | "triangle"
  | "pen"
  | "brush"
  | "highlighter"
  | "text"
  | "emoji"
  | "measure"
  | "magnet"
  | "lock"
  | "unlock"
  | "visibility"

export interface Point {
  time: number
  price: number
}

export interface Drawing {
  id: string
  type: DrawingTool
  points: Point[]
  color: string
  lineWidth: number
  locked: boolean
  visible: boolean
  text?: string
}

export class DrawingManager {
  private drawings: Drawing[] = []
  private listeners: Array<() => void> = []

  addDrawing(drawing: Drawing) {
    this.drawings.push(drawing)
    this.notifyListeners()
  }

  removeDrawing(id: string) {
    this.drawings = this.drawings.filter((d) => d.id !== id)
    this.notifyListeners()
  }

  clearAll() {
    this.drawings = []
    this.notifyListeners()
  }

  toggleVisibility() {
    this.drawings.forEach((d) => {
      d.visible = !d.visible
    })
    this.notifyListeners()
  }

  lockAll() {
    this.drawings.forEach((d) => {
      d.locked = true
    })
    this.notifyListeners()
  }

  unlockAll() {
    this.drawings.forEach((d) => {
      d.locked = false
    })
    this.notifyListeners()
  }

  getDrawings() {
    return this.drawings.filter((d) => d.visible)
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }
}

export function calculateFibonacciLevels(start: Point, end: Point): Point[] {
  const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
  const priceDiff = end.price - start.price

  return levels.map((level) => ({
    time: start.time,
    price: start.price + priceDiff * level,
  }))
}

export function calculateGannFan(start: Point, end: Point): Point[][] {
  const angles = [1 / 8, 1 / 4, 1 / 3, 1 / 2, 1, 2, 3, 4, 8]
  const timeDiff = end.time - start.time
  const priceDiff = end.price - start.price

  return angles.map((angle) => [
    start,
    {
      time: end.time,
      price: start.price + priceDiff * angle,
    },
  ])
}
