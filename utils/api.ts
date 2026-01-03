import { config, currentEnv, isDevelopment } from './config';

const BASE_URL = config.baseUrl;
const TIMEOUT = config.timeout;

export interface MaternityLeaveRequest {
  cityCode: string;
  expectedDeliveryDate: string;
  doctorRecommendDays?: number;
  difficultBirthLeaveDetail?: any;
  isMultipleBirth?: boolean;
  numberOfBabies: number;
  hasExtendedDays: boolean;
  isDifficultBirth: boolean;
  additionalDystociaDays?: number;
  isBreastFeeding?: boolean;
  numberOfKids?: number;
  isMiscarriage: boolean;
  isFirstTimeBirth?: boolean;
  miscarriageLeaveDetail?: any;
}

export interface TimeScope {
  type: string;
  days: number;
  startDate: string;
  endDate: string;
}

export interface MaternityLeaveResponse {
  requestId: number;
  resultId: number;
  lanId: string;
  employeeName: string;
  cityCode: string;
  cityName: string;
  totalDays: number;
  totalAllowanceDays: number;
  baseDays: number;
  dystociaDays: number;
  multiBabyDays: number;
  extendedDays: number;
  miscarriageLeaveDays: number;
  pubHolidaysCount: number;
  startDate: string;
  endDate: string;
  returnToWorkDate: string;
  timeScopeList: TimeScope[];
}

export interface MiscarriageLeaveDetail {
  cityCode: string;
  code: string;
  days: number;
  needOverrideDays: boolean;
  description: string;
}

export interface CityDO {
  id: number;
  code: string;
  chineseName: string;
  englishName: string;
  province: string;
  enabled: boolean;
  sortOrder: number;
  remark: any;
  createDate: string;
  createBy: string;
  updateDate: string;
  updateBy: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface AllowanceParams {
  avgSalary: number;
  monthsWorked: number;
  socialSecurityBase: number;
}

export interface UserProfile {
  nickName: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
}

export class API {
  static request(url: string, data: any, method: string = 'POST') {
    return new Promise((resolve, reject) => {
      const fullUrl = `${BASE_URL}${url}`;

      // 开发环境打印请求信息
      if (config.enableLog) {
        console.log('📤 API请求:', {
          url: fullUrl,
          method,
          data
        });
      }

      wx.request({
        url: fullUrl,
        method: method as any,
        data,
        header: {
          'content-type': 'application/json',
          'x-source-id': 'wechat-miniprogram',
          'x-app-id': 'wxd04c483b41ba7caf'
        },
        timeout: TIMEOUT,
        success: (res) => {
          // 开发环境打印响应信息
          if (config.enableLog) {
            console.log('📥 API响应:', {
              url: fullUrl,
              statusCode: res.statusCode,
              data: res.data
            });
          }

          if (res.statusCode === 200) {
            // 检查是否是标准响应格式 {code, message, data}
            const responseData = res.data as any;
            if (responseData && typeof responseData === 'object' && 'code' in responseData && 'data' in responseData) {
              // 标准响应格式，检查业务状态码
              if (responseData.code === 0) {
                resolve(responseData.data);
              } else {
                if (config.enableLog) {
                  console.warn('⚠️ API业务错误:', responseData.message);
                }
                reject(responseData);
              }
            } else {
              // 非标准格式，直接返回
              resolve(res.data);
            }
          } else {
            if (config.enableLog) {
              console.warn('⚠️ API状态码异常:', res.statusCode);
            }
            reject(res);
          }
        },
        fail: (err) => {
          // 开发环境打印错误信息
          if (config.enableLog) {
            console.error('❌ API请求失败:', {
              url: fullUrl,
              error: err
            });
          }
          reject(err);
        }
      });
    });
  }

  static calculateMaternityLeave(params: MaternityLeaveRequest): Promise<MaternityLeaveResponse> {
    return this.request('/api/maternity-leave/calculate', params) as Promise<MaternityLeaveResponse>;
  }

  static getMiscarriageRules(cityCode?: string): Promise<MiscarriageLeaveDetail[]> {
    const url = cityCode 
      ? `/api/maternity-leave/ref-data/miscarriage-rules?cityCode=${cityCode}`
      : '/api/maternity-leave/ref-data/miscarriage-rules';
    return this.request(url, {}, 'GET') as Promise<MiscarriageLeaveDetail[]>;
  }

  static getCities(): Promise<CityDO[]> {
    return this.request('/api/support/cities', {}, 'GET') as Promise<CityDO[]>;
  }

  static calculateAllowance(params: AllowanceParams) {
    return this.request('/allowance/calculate', params);
  }

  /**
   * 获取用户信息
   * 注意：需要用户授权，建议使用 button open-type="getUserProfile"
   */
  static getUserProfile(): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          if (config.enableLog) {
            console.log('👤 获取用户信息成功:', res.userInfo);
          }
          resolve(res.userInfo);
        },
        fail: (err) => {
          if (config.enableLog) {
            console.error('❌ 获取用户信息失败:', err);
          }
          reject(err);
        }
      });
    });
  }

  /**
   * 获取微信登录凭证 code
   */
  static getWxLoginCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            if (config.enableLog) {
              console.log('🔑 获取登录凭证成功:', res.code);
            }
            resolve(res.code);
          } else {
            reject(new Error('获取登录凭证失败'));
          }
        },
        fail: (err) => {
          if (config.enableLog) {
            console.error('❌ 获取登录凭证失败:', err);
          }
          reject(err);
        }
      });
    });
  }
}
