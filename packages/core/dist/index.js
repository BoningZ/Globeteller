"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Globeteller: () => Globeteller,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var Globeteller = class {
  constructor(config = {}) {
    __publicField(this, "config");
    this.config = {
      baseUrl: "https://api.openai.com/v1",
      ...config
    };
  }
  /**
   * 初始化 Globeteller
   */
  async init() {
    console.log("Globeteller core initialized");
  }
  /**
   * 获取配置
   */
  getConfig() {
    return { ...this.config };
  }
};
var index_default = Globeteller;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Globeteller
});
