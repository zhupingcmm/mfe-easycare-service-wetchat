/// <reference lib="es2020" />

declare namespace WechatMiniprogram {
  interface GetMenuButtonBoundingClientRectResult {
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  interface DeviceInfo {
    platform: string;
    [key: string]: any;
  }

  interface SafeArea {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  }

  interface WindowInfo {
    windowWidth: number;
    windowHeight: number;
    safeArea?: SafeArea;
    [key: string]: any;
  }

  interface SystemInfo extends WindowInfo, DeviceInfo {}

  interface NavigateBackOption {
    delta?: number;
    success?: (res: any) => void;
    fail?: (res: any) => void;
    complete?: (res: any) => void;
  }

  interface NavigateToOption {
    url: string;
    success?: (res: any) => void;
    fail?: (res: any) => void;
    complete?: (res: any) => void;
  }

  interface ShowToastOption {
    title: string;
    icon?: 'success' | 'loading' | 'none';
    duration?: number;
    success?: (res: any) => void;
    fail?: (res: any) => void;
    complete?: (res: any) => void;
  }

  interface ShowLoadingOption {
    title: string;
    mask?: boolean;
    success?: (res: any) => void;
    fail?: (res: any) => void;
    complete?: (res: any) => void;
  }

  interface ShowModalOption {
    title?: string;
    content?: string;
    showCancel?: boolean;
    cancelText?: string;
    cancelColor?: string;
    confirmText?: string;
    confirmColor?: string;
    success?: (res: { confirm: boolean; cancel: boolean }) => void;
    fail?: (res: any) => void;
    complete?: (res: any) => void;
  }

  interface RequestOption {
    url: string;
    data?: any;
    header?: any;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    timeout?: number;
    success?: (res: any) => void;
    fail?: (res: any) => void;
    complete?: (res: any) => void;
  }

  interface AppAuthorizeSetting {
    [key: string]: any;
  }

  interface UserInfo {
    nickName: string;
    avatarUrl: string;
    gender: number;
    country: string;
    province: string;
    city: string;
    language: string;
  }

  interface GetUserProfileOption {
    desc: string;
    success?: (res: { userInfo: UserInfo }) => void;
    fail?: (res: any) => void;
    complete?: (res: any) => void;
  }

  interface LoginOption {
    timeout?: number;
    success?: (res: { code: string }) => void;
    fail?: (res: any) => void;
    complete?: (res: any) => void;
  }

  interface GetUserInfoSuccessCallback {
    (res: { userInfo: UserInfo }): void;
  }
}

declare const wx: {
  getMenuButtonBoundingClientRect(): WechatMiniprogram.GetMenuButtonBoundingClientRectResult;
  getDeviceInfo(): WechatMiniprogram.DeviceInfo;
  getWindowInfo(): WechatMiniprogram.WindowInfo;
  getAppAuthorizeSetting(): WechatMiniprogram.AppAuthorizeSetting;
  getSystemInfoSync(): WechatMiniprogram.SystemInfo;
  getStorageSync(key: string): any;
  setStorageSync(key: string, data: any): void;
  navigateBack(option: WechatMiniprogram.NavigateBackOption): void;
  navigateTo(option: WechatMiniprogram.NavigateToOption): void;
  showToast(option: WechatMiniprogram.ShowToastOption): void;
  showLoading(option: WechatMiniprogram.ShowLoadingOption): void;
  hideLoading(): void;
  showModal(option: WechatMiniprogram.ShowModalOption): void;
  getUserProfile(option: WechatMiniprogram.GetUserProfileOption): void;
  login(option: WechatMiniprogram.LoginOption): void;
  request(option: WechatMiniprogram.RequestOption): void;
};

declare function App<T extends WechatMiniprogram.App>(options: T): void;
declare function Page<T extends WechatMiniprogram.Page>(options: T): void;
declare function Component<T extends WechatMiniprogram.ComponentOptions>(options: T): void;
declare function getApp<T = any>(): T;
declare function getCurrentPages<T = any>(): T[];
