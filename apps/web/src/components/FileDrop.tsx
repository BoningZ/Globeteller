import React, { useCallback, useState } from 'react';

// 内联类型定义，避免模块导入问题
interface Segment {
  coordinates: [number, number][];
  time: string;
  transport?: 'train' | 'plane' | 'car' | 'walk';
  photo?: string;
  note?: string;
}

interface Trip {
  title: string;
  language?: string;
  segments: Segment[];
}

interface ParsedTrip extends Trip {
  segments: Segment[];
  totalDuration: number;
  startTime: Date;
  endTime: Date;
}

// 内联解析函数，避免模块导入问题
function parseTrip(json: unknown): ParsedTrip {
  if (!json || typeof json !== 'object') {
    throw new Error('无效的 JSON 数据');
  }

  const tripData = json as Record<string, unknown>;

  if (!tripData.title || typeof tripData.title !== 'string') {
    throw new Error('缺少或无效的 title 字段');
  }

  if (!Array.isArray(tripData.segments) || tripData.segments.length === 0) {
    throw new Error('缺少或无效的 segments 数组');
  }

  const segments: Segment[] = tripData.segments.map((segment: unknown, index: number) => {
    const segmentData = segment as Record<string, unknown>;
    
    if (!segmentData.coordinates || !Array.isArray(segmentData.coordinates)) {
      throw new Error(`Segment ${index}: 缺少或无效的 coordinates 字段`);
    }

    if (!segmentData.time || typeof segmentData.time !== 'string') {
      throw new Error(`Segment ${index}: 缺少或无效的 time 字段`);
    }

    const coordinates = segmentData.coordinates.map((coord: unknown, coordIndex: number) => {
      if (!Array.isArray(coord) || coord.length !== 2) {
        throw new Error(`Segment ${index}, coordinate ${coordIndex}: 坐标格式错误`);
      }
      
      const [lon, lat] = coord;
      if (typeof lon !== 'number' || typeof lat !== 'number') {
        throw new Error(`Segment ${index}, coordinate ${coordIndex}: 坐标值必须是数字`);
      }

      if (lon < -180 || lon > 180) {
        throw new Error(`Segment ${index}, coordinate ${coordIndex}: 经度超出范围 [-180, 180]`);
      }
      if (lat < -90 || lat > 90) {
        throw new Error(`Segment ${index}, coordinate ${coordIndex}: 纬度超出范围 [-90, 90]`);
      }

      return [lon, lat] as [number, number];
    });

    const time = new Date(segmentData.time);
    if (isNaN(time.getTime())) {
      throw new Error(`Segment ${index}: 无效的时间格式`);
    }

    return {
      coordinates,
      time: segmentData.time,
      transport: segmentData.transport as 'train' | 'plane' | 'car' | 'walk' | undefined,
      photo: segmentData.photo as string | undefined,
      note: segmentData.note as string | undefined,
    };
  });

  segments.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  const times = segments.map(s => new Date(s.time));
  const startTime = new Date(Math.min(...times.map(t => t.getTime())));
  const endTime = new Date(Math.max(...times.map(t => t.getTime())));
  const totalDuration = endTime.getTime() - startTime.getTime();

  return {
    title: tripData.title,
    language: tripData.language as string | undefined,
    segments,
    totalDuration,
    startTime,
    endTime,
  };
}

interface FileDropProps {
  onTripLoad: (trip: ParsedTrip) => void;
}

export function FileDrop({ onTripLoad }: FileDropProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => file.name.endsWith('.json'));

    if (!jsonFile) {
      setError('请拖入 trip.json 文件');
      return;
    }

    try {
      const text = await jsonFile.text();
      const json = JSON.parse(text);
      
      const trip = parseTrip(json);
      
      onTripLoad(trip);
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件解析失败');
    }
  }, [onTripLoad]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      const trip = parseTrip(json);
      
      onTripLoad(trip);
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件解析失败');
    }
  }, [onTripLoad]);

  return (
    <div className="file-drop-container">
      <div
        className={`file-drop-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="file-drop-content">
          <div className="file-drop-icon">📁</div>
          <h3>拖入 trip.json 文件</h3>
          <p>或者点击选择文件</p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileInput}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            选择文件
          </label>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
    </div>
  );
} 