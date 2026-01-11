/**
 * 环境配置文件
 * 用于管理不同环境的配置信息
 */

export type Environment = 'development' | 'production';

export interface EnvironmentConfig {
  baseUrl: string;
  timeout: number;
  enableLog: boolean;
}

// 环境配置
export const ENV_CONFIG: Record<Environment, EnvironmentConfig> = {
  // 开发环境
  development: {
    baseUrl: 'http://localhost:8080',
    timeout: 30000,
    enableLog: true
  },
  // 生产环境
  production: {
    baseUrl: 'http://8.153.38.116:8080',
    timeout: 10000,
    enableLog: false
  }
};

/**
 * 获取当前运行环境
 * @returns 当前环境类型
 */
export function getCurrentEnvironment(): Environment {
  // 通过微信小程序的 __wxConfig 判断
  if (typeof __wxConfig !== 'undefined') {
    const envVersion = __wxConfig.envVersion;
    
    // envVersion 可能的值:
    // - 'develop': 开发版
    // - 'trial': 体验版
    // - 'release': 正式版
    
    if (envVersion === 'release') {
      return 'production';
    } else {
      return 'development';
    }
  }
  
  // 默认返回开发环境（用于本地调试）
  return 'development';
}

/**
 * 获取当前环境的配置
 * @returns 当前环境配置对象
 */
export function getConfig(): EnvironmentConfig {
  const env = getCurrentEnvironment();
  return ENV_CONFIG[env];
}

/**
 * 判断是否为开发环境
 * @returns 是否为开发环境
 */
export function isDevelopment(): boolean {
  return getCurrentEnvironment() === 'development';
}

/**
 * 判断是否为生产环境
 * @returns 是否为生产环境
 */
export function isProduction(): boolean {
  return getCurrentEnvironment() === 'production';
}

// 导出当前环境信息
export const currentEnv = getCurrentEnvironment();
export const config = getConfig();

// 控制台输出当前环境信息（仅开发环境）
if (isDevelopment()) {
  console.log('=== 环境信息 ===');
  console.log('当前环境:', currentEnv);
  console.log('API地址:', config.baseUrl);
  console.log('超时时间:', config.timeout);
  console.log('日志开关:', config.enableLog);
  console.log('===============');
}
