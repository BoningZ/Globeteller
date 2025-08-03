# Globeteller

一个基于 React + TypeScript + Vite 的 monorepo 项目，集成了地图可视化和 AI 功能。

## 项目结构

```
Globeteller/
├── apps/
│   └── web/              # React 前端应用
├── packages/
│   ├── core/             # 核心库包
│   └── cli/              # CLI 工具包
├── trips/
│   └── demo/             # 示例旅行数据
└── package.json          # 根配置
```

## 技术栈

- **前端**: React 19, TypeScript, Vite
- **地图**: @deck.gl/core, @deck.gl/react, @deck.gl/layers
- **AI**: OpenAI API
- **构建**: tsup, TypeScript
- **Node 版本**: >= 20

## 开发指南

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
# 启动 web 应用
cd apps/web && npm run dev

# 构建所有包
npm run build
```

### 测试应用
1. 启动开发服务器：`cd apps/web && npm run dev`
2. 访问 `http://localhost:5173/test.html` 下载示例数据
3. 回到主页面，拖入 trip.json 文件查看效果

### 项目特点
- 使用 monorepo 架构管理多包
- 集成地图可视化功能
- 支持 AI 功能集成
- 完整的 TypeScript 支持
- 文件拖拽上传功能
- 3D 地球轨迹动画

## MVP 功能

✅ **已完成的功能**：
1. ✅ 拖入 `trip.json` → `parseTrip` → `useState` 持有
2. ✅ `Globe.tsx`：DeckGL + LineLayer 渲染轨迹
3. ✅ 简单动画：`setInterval` 每 16 ms 递增 `currentTime`
4. ✅ 示例数据：`trips/demo/trip.json` 北京→上海→东京折线

🎯 **下一步计划**：
- Timeline 滑条控制
- 多 Segment 颜色映射
- EXIF 照片解析
- AI 日志生成
- 视频导出功能 