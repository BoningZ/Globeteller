#!/usr/bin/env node
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/index.ts
import { Globeteller } from "@globeteller/core";
async function main() {
  try {
    const globeteller = new Globeteller();
    await globeteller.init();
    console.log("Globeteller CLI started");
    console.log("Configuration:", globeteller.getConfig());
    console.log("CLI functionality coming soon...");
  } catch (error) {
    console.error("Error starting Globeteller CLI:", error);
    process.exit(1);
  }
}
if (__require.main === module) {
  main();
}
export {
  main
};
