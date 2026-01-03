/// <reference path="./wx.d.ts" />

// 微信小程序全局变量
declare const __wxConfig: {
  envVersion: 'develop' | 'trial' | 'release';
  [key: string]: any;
};

// 全局 console 对象
declare const console: {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
};

declare namespace WechatMiniprogram {
  interface UserInfo {
    nickName: string;
    avatarUrl: string;
    gender: number;
    country: string;
    province: string;
    city: string;
    language: string;
  }

  interface App {
    globalData?: Record<string, any>;
    onLaunch?: (options?: any) => void;
    onShow?: (options?: any) => void;
    onHide?: () => void;
    onError?: (msg: string) => void;
    [key: string]: any;
  }

  interface Page {
    data?: Record<string, any>;
    onLoad?: (query?: Record<string, string>) => void;
    onShow?: () => void;
    onReady?: () => void;
    onHide?: () => void;
    onUnload?: () => void;
    onPullDownRefresh?: () => void;
    onReachBottom?: () => void;
    onShareAppMessage?: (options?: any) => any;
    onPageScroll?: (options?: any) => void;
    onTabItemTap?: (options?: any) => void;
    [key: string]: any;
  }

  interface ComponentInstance {
    data: Record<string, any>;
    properties: Record<string, any>;
    setData(data: Record<string, any>, callback?: () => void): void;
    triggerEvent(name: string, detail?: any, options?: any): void;
    [key: string]: any;
  }

  interface ComponentOptions {
    options?: {
      multipleSlots?: boolean;
      addGlobalClass?: boolean;
      styleIsolation?: string;
      [key: string]: any;
    };
    properties?: Record<string, any>;
    data?: Record<string, any>;
    lifetimes?: {
      created?: (this: ComponentInstance) => void;
      attached?: (this: ComponentInstance) => void;
      ready?: (this: ComponentInstance) => void;
      moved?: (this: ComponentInstance) => void;
      detached?: (this: ComponentInstance) => void;
      error?: (this: ComponentInstance, err: Error) => void;
    };
    methods?: Record<string, (this: ComponentInstance, ...args: any[]) => any>;
    observers?: Record<string, any>;
    [key: string]: any;
  }
}
