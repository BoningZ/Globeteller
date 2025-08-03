import { useState, useEffect } from 'react'
import { FileDrop } from './components/FileDrop'
import { SphereGlobe } from './components/SphereGlobe'
import './App.css'

// 内联类型定义
interface ParsedTrip {
  title: string;
  language?: string;
  segments: Array<{
    coordinates: [number, number][];
    time: string;
    transport?: 'train' | 'plane' | 'car' | 'walk';
    photo?: string;
    note?: string;
  }>;
  totalDuration: number;
  startTime: Date;
  endTime: Date;
}

function App() {
  const [trip, setTrip] = useState<ParsedTrip | null>(null)
  const [currentTime, setCurrentTime] = useState<number>(Date.now())

  // 动画循环
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 16) // 60fps

    return () => clearInterval(interval)
  }, [])

  const handleTripLoad = (loadedTrip: ParsedTrip) => {
    setTrip(loadedTrip)
  }

  return (
    <div className="app">
      {!trip ? (
        <div className="file-drop-section">
          <h1>🌍 Globeteller</h1>
          <p>拖入 trip.json 文件开始可视化你的旅行轨迹</p>
          <FileDrop onTripLoad={handleTripLoad} />
        </div>
      ) : (
        <div className="globe-section">
          <SphereGlobe trip={trip} currentTime={currentTime} />
          <div className="controls">
            <button onClick={() => setTrip(null)}>重新选择文件</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
