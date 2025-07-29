// @globeteller/core
// 核心功能模块

export interface GlobetellerConfig {
  apiKey?: string;
  baseUrl?: string;
}

export class Globeteller {
  private config: GlobetellerConfig;

  constructor(config: GlobetellerConfig = {}) {
    this.config = {
      baseUrl: 'https://api.openai.com/v1',
      ...config
    };
  }

  /**
   * 初始化 Globeteller
   */
  async init(): Promise<void> {
    // 初始化逻辑
    console.log('Globeteller core initialized');
  }

  /**
   * 获取配置
   */
  getConfig(): GlobetellerConfig {
    return { ...this.config };
  }
}

// 默认导出
export default Globeteller; 