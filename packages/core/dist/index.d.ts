interface GlobetellerConfig {
    apiKey?: string;
    baseUrl?: string;
}
declare class Globeteller {
    private config;
    constructor(config?: GlobetellerConfig);
    /**
     * 初始化 Globeteller
     */
    init(): Promise<void>;
    /**
     * 获取配置
     */
    getConfig(): GlobetellerConfig;
}

export { Globeteller, type GlobetellerConfig, Globeteller as default };
