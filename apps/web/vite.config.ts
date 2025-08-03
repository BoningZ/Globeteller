import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Globeteller Web 应用配置
 * 
 * 项目信息:
 * - 基于 React 19 + TypeScript + Vite
 * - 集成 @deck.gl 地图可视化
 * - 支持 OpenAI API 集成
 * - Monorepo 架构中的 web 应用
 * 
 * https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react()],
})
