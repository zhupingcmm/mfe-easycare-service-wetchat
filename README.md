# 生育关怀服务小程序

这是一个基于 TypeScript 开发的微信小程序，提供产假计算和津贴计算功能。

## 功能模块

### 1. 产假计算
- 根据预产期、年龄、是否初育、是否剖宫产、是否多胞胎等信息计算产假天数
- 显示产假开始和结束日期
- 提供详细的假期说明

### 2. 津贴计算
- 根据平均工资、社保缴费基数、缴费月数计算生育津贴
- 显示生育津贴和医疗费用明细
- 提供计算说明和温馨提示

## 技术栈

- **框架**: 微信小程序
- **语言**: TypeScript
- **UI**: Skyline 渲染引擎
- **组件框架**: glass-easel

## 项目结构

```
├── pages/                  # 页面目录
│   ├── index/             # 首页
│   ├── maternity-leave/   # 产假计算页面
│   └── allowance/         # 津贴计算页面
├── components/            # 组件目录
│   └── navigation-bar/    # 自定义导航栏组件
├── utils/                 # 工具类
│   ├── api.ts            # API 接口封装
│   └── calculator.ts     # 计算工具（已废弃，改用后台接口）
├── typings/              # TypeScript 类型定义
│   ├── index.d.ts        # 小程序类型定义
│   └── wx.d.ts           # 微信 API 类型定义
├── app.ts                # 小程序入口
├── app.json              # 小程序配置
└── tsconfig.json         # TypeScript 配置
```

## 后台接口配置

### API 基础地址

项目支持开发环境和生产环境自动切换，在 `utils/config.ts` 中配置：

```typescript
export const ENV_CONFIG = {
  development: {
    baseUrl: 'https://dev-api.your-domain.com',  // 开发环境
    timeout: 30000,
    enableLog: true
  },
  production: {
    baseUrl: 'https://api.your-domain.com',      // 生产环境
    timeout: 10000,
    enableLog: false
  }
};
```

**环境自动识别：**
- 开发版/体验版 → 使用开发环境配置
- 正式版 → 使用生产环境配置
- 本地调试 → 使用开发环境配置

### 接口说明

#### 1. 产假计算接口
**接口地址**: `POST /api/maternity-leave/calculate`

**请求参数**:
```typescript
{
  lanId: string;                    // 工号
  employeeName: string;             // 姓名
  cityCode: string;                 // 城市代码（SH/BJ/GZ/CD/SX等）
  expectedDeliveryDate: string;     // 预产期，格式：YYYY-MM-DD
  numberOfBabies: number;           // 婴儿数量（必须>0）
  hasExtendedDays: boolean;         // 是否有晚育假/生育假/奖励假
  isDifficultBirth: boolean;        // 是否难产
  isMultipleBirth: boolean;         // 是否多胞胎
  isMiscarriage: boolean;           // 是否流产
  doctorRecommendDays?: number;     // 医嘱天数（可选）
  additionalDystociaDays?: number;  // 难产假期天数（广州15/30天，可选）
  isBreastFeeding?: boolean;        // 是否母乳喂养（成都特有，可选）
  isFirstTimeBirth?: boolean;       // 是否生育一孩（绍兴特有，可选）
}
```

**返回数据**:
```typescript
{
  requestId: number;              // 申请记录ID
  resultId: number;               // 计算结果ID
  lanId: string;                  // 工号
  employeeName: string;           // 姓名
  cityCode: string;               // 城市代码
  cityName: string;               // 城市名称
  totalDays: number;              // 产假总天数
  totalAllowanceDays: number;     // 津贴总天数
  baseDays: number;               // 基础产假天数
  dystociaDays: number;           // 难产假天数
  multiBabyDays: number;          // 多胞胎假天数
  extendedDays: number;           // 晚育假/生育假/奖励假天数
  miscarriageLeaveDays: number;   // 流产假天数
  pubHolidaysCount: number;       // 公共节假日顺延天数
  startDate: string;              // 产假开始日期
  endDate: string;                // 产假结束日期
  returnToWorkDate: string;       // 返岗日期
  timeScopeList: Array<{          // 假期时间段详情
    type: string;                 // 假期类型
    days: number;                 // 天数
    startDate: string;            // 开始日期
    endDate: string;              // 结束日期
  }>;
}
```

#### 2. 津贴计算接口
**接口地址**: `POST /allowance/calculate`

**请求参数**:
```typescript
{
  avgSalary: number;           // 平均工资（元/月）
  monthsWorked: number;        // 连续缴费月数
  socialSecurityBase: number;  // 社保缴费基数（可选，默认为平均工资）
}
```

**返回数据**:
```typescript
{
  totalAmount: number;         // 总津贴金额
  maternityAllowance: number;  // 生育津贴
  medicalAllowance: number;    // 医疗费用
  details: string[];           // 计算说明
}
```

## 开发指南

### 环境要求
- Node.js >= 14.0.0
- 微信开发者工具

### 安装依赖
```bash
npm install
```

### 编译 TypeScript
微信开发者工具会自动编译 TypeScript 文件，无需手动运行编译命令。

如需手动编译：
```bash
npm run tsc
```

### 开发调试
1. 使用微信开发者工具打开项目
2. 在工具中点击"编译"按钮
3. 在模拟器中预览效果

## 注意事项

1. **TypeScript 编译**: 项目已配置 `useTypeScript: true`，开发工具会自动编译 `.ts` 文件为 `.js` 文件
2. **接口配置**: 使用前需要在 `utils/api.ts` 中配置正确的后台接口地址
3. **错误处理**: 所有接口调用都包含了错误处理，会在失败时显示提示信息
4. **数据验证**: 表单提交前会进行基本的数据验证

## 页面截图

### 首页
- 显示产假计算和津贴计算两个功能入口
- 采用卡片式设计，简洁美观

### 产假计算页面
- 表单输入：预产期、年龄、是否初育、是否剖宫产、是否多胞胎
- 结果展示：总天数、基础天数、额外天数、开始日期、结束日期、详细说明

### 津贴计算页面
- 表单输入：平均工资、社保缴费基数、缴费月数
- 结果展示：总津贴、生育津贴、医疗费用、计算说明

## 后续优化建议

1. 添加用户登录功能
2. 保存历史计算记录
3. 添加更多地区的政策支持
4. 提供政策法规查询功能
5. 添加数据统计和分析功能
