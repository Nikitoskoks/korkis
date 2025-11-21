"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  type ISeriesApi,
  type CandlestickData,
  type HistogramData,
  type LineData,
  type IChartApi,
} from "lightweight-charts";
import type { Candle } from "@/lib/chart-data";
import {
  calculateEMA,
  calculateVWAP,
  calculateRSI,
  calculateMACD,
  calculateATR,
} from "@/lib/indicators";

type IndicatorsState = {
  ema50?: boolean;
  ema200?: boolean;
  rsi?: boolean;
  macd?: boolean;
  volume?: boolean;
  vwap?: boolean;
  atr?: boolean;
};

interface CustomTVChartProps {
  candles: Candle[];
  indicators?: IndicatorsState;
  activeTool?: string;
}

// === helper: ms → seconds (lightweight-charts time) ===
const toSec = (t: number) => Math.floor(t / 1000) as any;

// === синхронный скролл / зум как в TradingView ===
function setupTimeSync(charts: IChartApi[]) {
  if (charts.length <= 1) return;

  let isSyncing = false;

  charts.forEach((source) => {
    const timeScale = source.timeScale();

    // по времени
    timeScale.subscribeVisibleTimeRangeChange((range) => {
      if (!range || isSyncing) return;
      isSyncing = true;
      charts.forEach((chart) => {
        if (chart === source) return;
        chart.timeScale().setVisibleRange(range as any);
      });
      isSyncing = false;
    });

    // по логическому диапазону (скролл/зум колесом)
    timeScale.subscribeVisibleLogicalRangeChange((range) => {
      if (!range || isSyncing) return;
      isSyncing = true;
      charts.forEach((chart) => {
        if (chart === source) return;
        chart.timeScale().setVisibleLogicalRange(range as any);
      });
      isSyncing = false;
    });
  });
}

export function CustomTVChart({
  candles,
  indicators = {},
  activeTool,
}: CustomTVChartProps) {
  // ==== контейнеры ====
  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  const rsiContainerRef = useRef<HTMLDivElement | null>(null);
  const macdContainerRef = useRef<HTMLDivElement | null>(null);
  const atrContainerRef = useRef<HTMLDivElement | null>(null);

  // ==== chart refs ====
  const mainChartRef = useRef<IChartApi | null>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);
  const macdChartRef = useRef<IChartApi | null>(null);
  const atrChartRef = useRef<IChartApi | null>(null);

  // ==== series refs (основной чарт) ====
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const ema50SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ema200SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const vwapSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  // ==== series refs (RSI / MACD / ATR) ====
  const rsiSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const macdLineRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSignalRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdHistRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const atrSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  // =========================
  // 1) ИНИЦИАЛИЗАЦИЯ ЧАРТОВ
  // =========================
  useEffect(() => {
    // --- главный график ---
    if (!mainChartRef.current && mainContainerRef.current) {
      const chart = createChart(mainContainerRef.current, {
        autoSize: true,
        layout: {
          background: { type: ColorType.Solid, color: "#0f172a" },
          textColor: "#cbd5e1",
        },
        grid: {
          vertLines: { color: "rgba(148,163,184,0.15)" },
          horzLines: { color: "rgba(148,163,184,0.15)" },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: "rgba(248,250,252,0.6)",
            width: 1,
            style: 0,
          },
          horzLine: {
            color: "rgba(248,250,252,0.6)",
            width: 1,
            style: 0,
          },
        },
        rightPriceScale: {
          borderColor: "rgba(148,163,184,0.4)",
          scaleMargins: {
            top: 0.1,
            bottom: 0.25, // нижняя четверть — объём
          },
        },
        timeScale: {
          borderColor: "rgba(148,163,184,0.4)",
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 5,
          barSpacing: 8,
        },
      });

      chart.applyOptions({
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderUpColor: "#22c55e",
        borderDownColor: "#ef4444",
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      });

      const volumeSeries = chart.addHistogramSeries({
        priceScaleId: "volume",
        priceFormat: { type: "volume" },
        baseLineVisible: false,
      });

      chart.priceScale("volume").applyOptions({
        scaleMargins: {
          top: 0.75,
          bottom: 0,
        },
      });

      const ema50Series = chart.addLineSeries({
        color: "#3b82f6",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      const ema200Series = chart.addLineSeries({
        color: "#a855f7",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      const vwapSeries = chart.addLineSeries({
        color: "#eab308",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      mainChartRef.current = chart;
      candleSeriesRef.current = candleSeries;
      volumeSeriesRef.current = volumeSeries;
      ema50SeriesRef.current = ema50Series;
      ema200SeriesRef.current = ema200Series;
      vwapSeriesRef.current = vwapSeries;
    }

    // --- RSI панель ---
    if (!rsiChartRef.current && rsiContainerRef.current) {
      const rsiChart = createChart(rsiContainerRef.current, {
        autoSize: true,
        layout: {
          background: { type: ColorType.Solid, color: "#020617" },
          textColor: "#cbd5e1",
        },
        grid: {
          vertLines: { color: "rgba(148,163,184,0.12)" },
          horzLines: { color: "rgba(148,163,184,0.12)" },
        },
        rightPriceScale: {
          borderColor: "rgba(148,163,184,0.4)",
        },
        timeScale: {
          borderColor: "rgba(148,163,184,0.4)",
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 5,
          barSpacing: 8,
        },
      });

      rsiChart.applyOptions({
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      const rsiSeries = rsiChart.addLineSeries({
        color: "#8b5cf6",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      // линии RSI 70 / 30
      rsiSeries.createPriceLine({
        price: 70,
        color: "rgba(148,163,184,0.6)",
        lineWidth: 1,
        lineStyle: 2,
      });
      rsiSeries.createPriceLine({
        price: 30,
        color: "rgba(148,163,184,0.6)",
        lineWidth: 1,
        lineStyle: 2,
      });

      rsiChartRef.current = rsiChart;
      rsiSeriesRef.current = rsiSeries;
    }

    // --- MACD панель ---
    if (!macdChartRef.current && macdContainerRef.current) {
      const macdChart = createChart(macdContainerRef.current, {
        autoSize: true,
        layout: {
          background: { type: ColorType.Solid, color: "#020617" },
          textColor: "#cbd5e1",
        },
        grid: {
          vertLines: { color: "rgba(148,163,184,0.12)" },
          horzLines: { color: "rgba(148,163,184,0.12)" },
        },
        rightPriceScale: {
          borderColor: "rgba(148,163,184,0.4)",
        },
        timeScale: {
          borderColor: "rgba(148,163,184,0.4)",
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 5,
          barSpacing: 8,
        },
      });

      macdChart.applyOptions({
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      const macdLine = macdChart.addLineSeries({
        color: "#38bdf8",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      const macdSignal = macdChart.addLineSeries({
        color: "#f97316",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      const macdHist = macdChart.addHistogramSeries({
        baseLineVisible: false,
      });

      macdChartRef.current = macdChart;
      macdLineRef.current = macdLine;
      macdSignalRef.current = macdSignal;
      macdHistRef.current = macdHist;
    }

    // --- ATR панель ---
    if (!atrChartRef.current && atrContainerRef.current) {
      const atrChart = createChart(atrContainerRef.current, {
        autoSize: true,
        layout: {
          background: { type: ColorType.Solid, color: "#020617" },
          textColor: "#cbd5e1",
        },
        grid: {
          vertLines: { color: "rgba(148,163,184,0.12)" },
          horzLines: { color: "rgba(148,163,184,0.12)" },
        },
        rightPriceScale: {
          borderColor: "rgba(148,163,184,0.4)",
        },
        timeScale: {
          borderColor: "rgba(148,163,184,0.4)",
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 5,
          barSpacing: 8,
        },
      });

      atrChart.applyOptions({
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      const atrSeries = atrChart.addLineSeries({
        color: "#facc15",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      atrChartRef.current = atrChart;
      atrSeriesRef.current = atrSeries;
    }

    // --- СИНХРОНИЗАЦИЯ ВРЕМЕНИ МЕЖДУ ВСЕМИ ЧАРТАМИ ---
    const charts: IChartApi[] = [];
    if (mainChartRef.current) charts.push(mainChartRef.current);
    if (rsiChartRef.current) charts.push(rsiChartRef.current);
    if (macdChartRef.current) charts.push(macdChartRef.current);
    if (atrChartRef.current) charts.push(atrChartRef.current);

    setupTimeSync(charts);

    return () => {
      mainChartRef.current?.remove();
      rsiChartRef.current?.remove();
      macdChartRef.current?.remove();
      atrChartRef.current?.remove();
      mainChartRef.current = null;
      rsiChartRef.current = null;
      macdChartRef.current = null;
      atrChartRef.current = null;
    };
  }, []);

  // =========================
  // 2) ОБНОВЛЕНИЕ ДАННЫХ
  // =========================
  useEffect(() => {
    if (!mainChartRef.current || !candleSeriesRef.current || candles.length === 0) {
      return;
    }

    const closes = candles.map((c) => c.close);

    // ----- свечи -----
    const candleData: CandlestickData[] = candles.map((c) => ({
      time: toSec(c.time),
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    candleSeriesRef.current.setData(candleData);

    // ----- объём -----
    if (volumeSeriesRef.current) {
      if (indicators.volume === false) {
        volumeSeriesRef.current.setData([]);
      } else {
        const volumeData: HistogramData[] = candles.map((c) => ({
          time: toSec(c.time),
          value: Number((c as any).volume) || 0,
          color:
            c.close >= c.open
              ? "rgba(34,197,94,0.5)"
              : "rgba(239,68,68,0.5)",
        }));
        volumeSeriesRef.current.setData(volumeData);
      }
    }

    // ----- EMA 50 -----
    if (ema50SeriesRef.current) {
      if (indicators.ema50) {
        const ema = calculateEMA(closes, 50);
        const data: LineData[] = [];
        ema.forEach((v, i) => {
          if (v != null) {
            data.push({
              time: toSec(candles[i].time),
              value: v,
            });
          }
        });
        ema50SeriesRef.current.setData(data);
      } else {
        ema50SeriesRef.current.setData([]);
      }
    }

    // ----- EMA 200 -----
    if (ema200SeriesRef.current) {
      if (indicators.ema200) {
        const ema = calculateEMA(closes, 200);
        const data: LineData[] = [];
        ema.forEach((v, i) => {
          if (v != null) {
            data.push({
              time: toSec(candles[i].time),
              value: v,
            });
          }
        });
        ema200SeriesRef.current.setData(data);
      } else {
        ema200SeriesRef.current.setData([]);
      }
    }

    // ----- VWAP -----
    if (vwapSeriesRef.current) {
      if (indicators.vwap) {
        const vwapArr = calculateVWAP(candles as any);
        const data: LineData[] = vwapArr.map((v, i) => ({
          time: toSec(candles[i].time),
          value: v,
        }));
        vwapSeriesRef.current.setData(data);
      } else {
        vwapSeriesRef.current.setData([]);
      }
    }

    // ----- RSI панель -----
    if (rsiChartRef.current && rsiSeriesRef.current) {
      if (indicators.rsi) {
        const rsi = calculateRSI(closes, 14);
        const data: LineData[] = [];
        rsi.forEach((v, i) => {
          if (v != null) {
            data.push({
              time: toSec(candles[i].time),
              value: v,
            });
          }
        });
        rsiSeriesRef.current.setData(data);
      } else {
        rsiSeriesRef.current.setData([]);
      }
    }

    // ----- MACD панель -----
    if (
      macdChartRef.current &&
      macdLineRef.current &&
      macdSignalRef.current &&
      macdHistRef.current
    ) {
      if (indicators.macd) {
        const { macdLine, signalLine, histogram } = calculateMACD(closes);

        const macdData: LineData[] = [];
        const signalData: LineData[] = [];
        const histData: HistogramData[] = [];

        macdLine.forEach((v, i) => {
          if (v != null) {
            macdData.push({
              time: toSec(candles[i].time),
              value: v,
            });
          }
        });

        signalLine.forEach((v, i) => {
          if (v != null) {
            signalData.push({
              time: toSec(candles[i].time),
              value: v,
            });
          }
        });

        histogram.forEach((v, i) => {
          if (v != null) {
            histData.push({
              time: toSec(candles[i].time),
              value: v,
              color:
                v >= 0
                  ? "rgba(34,197,94,0.7)"
                  : "rgba(239,68,68,0.7)",
            });
          }
        });

        macdLineRef.current.setData(macdData);
        macdSignalRef.current.setData(signalData);
        macdHistRef.current.setData(histData);
      } else {
        macdLineRef.current.setData([]);
        macdSignalRef.current.setData([]);
        macdHistRef.current.setData([]);
      }
    }

    // ----- ATR панель -----
    if (atrChartRef.current && atrSeriesRef.current) {
      if (indicators.atr) {
        const atrArr = calculateATR(candles as any);
        const data: LineData[] = atrArr.map((v, i) => ({
          time: toSec(candles[i].time),
          value: v,
        }));
        atrSeriesRef.current.setData(data);
      } else {
        atrSeriesRef.current.setData([]);
      }
    }

    // Подгоняем диапазон по данным (остальное догонит через синк)
    if (candles.length > 0 && mainChartRef.current) {
      mainChartRef.current.timeScale().fitContent();
    }
  }, [candles, indicators]);

  // Пока activeTool «на будущее»
  useEffect(() => {
    if (!activeTool) return;
    console.log("[Chart] Active tool:", activeTool);
  }, [activeTool]);

  // =========================
  // РЕНДЕР
  // =========================
  return (
    <div className="w-full h-full min-h-[400px] rounded-[24px] bg-[#020617] border border-slate-800 flex flex-col">
      {/* Основной график */}
      <div ref={mainContainerRef} className="flex-1 min-h-[260px]" />

      {/* RSI панель */}
      <div
        ref={rsiContainerRef}
        className={`border-t border-slate-800 ${
          indicators.rsi ? "h-32" : "h-0 hidden"
        }`}
      />

      {/* MACD панель */}
      <div
        ref={macdContainerRef}
        className={`border-t border-slate-800 ${
          indicators.macd ? "h-32" : "h-0 hidden"
        }`}
      />

      {/* ATR панель */}
      <div
        ref={atrContainerRef}
        className={`border-t border-slate-800 ${
          indicators.atr ? "h-28" : "h-0 hidden"
        }`}
      />
    </div>
  );
}
