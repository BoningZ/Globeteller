#!/usr/bin/env node
// @globeteller/cli
// 命令行工具

import { Globeteller } from '@globeteller/core';

async function main() {
  try {
    const globeteller = new Globeteller();
    await globeteller.init();
    
    console.log('Globeteller CLI started');
    console.log('Configuration:', globeteller.getConfig());
    
    // CLI 逻辑将在这里实现
    console.log('CLI functionality coming soon...');
    
  } catch (error) {
    console.error('Error starting Globeteller CLI:', error);
    process.exit(1);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main();
}

export { main }; 