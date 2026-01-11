import { API, MaternityLeaveResponse, CityDO, MiscarriageRuleDO } from '../../utils/api';

Page({
  data: {
    activeTab: 'maternity',
    
    // 产假计算相关
    cityCode: '',
    cityName: '',
    maternityStartDate: '',
    numberOfBabies: 1,
    deliveryType: 'normal', // normal, difficult, miscarriage
    hasExtendedDays: false,
    isMultipleBirth: false,
    isBreastFeeding: false,
    isFirstTimeBirth: false,
    additionalDystociaDays: 0,
    doctorRecommendDays: 0,
    miscarriageRules: [] as MiscarriageRuleDO[],
    miscarriageRuleDescriptions: [] as string[],
    miscarriageRuleIndex: 0,
    loadingMiscarriageRules: false,
    multipleOptions: ['单胎', '双胞胎', '三胞胎', '四胞胎', '五胞胎'],
    multipleIndex: 0,
    cities: [] as CityDO[],
    cityNames: [] as string[],
    cityIndex: 0,
    loadingCities: true,
    babyCountOptions: [1, 2, 3, 4, 5],
    babyCountIndex: 0,
    maternityResult: null as MaternityLeaveResponse | null,
    showMaternityResult: false,
    
    // 津贴计算相关
    govTotalAmount: '',
    avgSalaryBefore12Months: '',
    baseSalary: '',
    allowanceResult: null as any,
    showAllowanceResult: false
  },
  
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 产假计算相关方法
  onCityChange(e: any) {
    const index = e.detail.value;
    const cities = this.data.cities;
    if (cities && cities[index]) {
      const cityCode = cities[index].code;
      this.setData({
        cityIndex: index,
        cityCode: cityCode,
        cityName: cities[index].chineseName
      });
      
      // 加载该城市的流产规则
      this.loadMiscarriageRules(cityCode);
    }
  },

  onMaternityStartDateChange(e: any) {
    this.setData({ maternityStartDate: e.detail.value });
  },

  onNumberOfBabiesChange(e: any) {
    const index = e.detail.value;
    const value = this.data.babyCountOptions[index];
    this.setData({
      babyCountIndex: index,
      numberOfBabies: value,
      isMultipleBirth: value > 1,
      multipleIndex: value - 1 // 同步更新几胞胎选择
    });
  },

  onDeliveryTypeChange(e: any) {
    this.setData({ 
      deliveryType: e.detail.value,
      miscarriageRuleIndex: 0
    });
  },

  onMiscarriageRuleChange(e: any) {
    this.setData({ miscarriageRuleIndex: e.detail.value });
  },

  onMultipleChange(e: any) {
    const index = e.detail.value;
    const value = index + 1; // 单胎=1, 双胞胎=2, etc.
    this.setData({
      multipleIndex: index,
      numberOfBabies: value,
      isMultipleBirth: value > 1
    });
  },

  onHasExtendedDaysChange(e: any) {
    this.setData({ hasExtendedDays: e.detail.value });
  },

  async calculateMaternity() {
    const { cityCode, maternityStartDate, numberOfBabies, deliveryType, hasExtendedDays, isMultipleBirth, isBreastFeeding, isFirstTimeBirth, additionalDystociaDays, doctorRecommendDays, miscarriageRuleIndex } = this.data;

    if (!cityCode) {
      wx.showToast({ title: '请选择城市', icon: 'none' });
      return;
    }

    if (!maternityStartDate) {
      wx.showToast({ title: '请选择产假开始时间', icon: 'none' });
      return;
    }

    if (deliveryType === 'miscarriage' && miscarriageRuleIndex === undefined) {
      wx.showToast({ title: '请选择流产规则', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '计算中...' });

    try {
      const isDifficultBirth = deliveryType === 'difficult';
      const isMiscarriage = deliveryType === 'miscarriage';
      
      const result = await API.calculateMaternityLeave({
        cityCode,
        expectedDeliveryDate: maternityStartDate,
        numberOfBabies,
        hasExtendedDays,
        isDifficultBirth,
        isMultipleBirth,
        isMiscarriage,
        isBreastFeeding,
        isFirstTimeBirth,
        additionalDystociaDays: additionalDystociaDays || undefined,
        doctorRecommendDays: doctorRecommendDays || undefined
      });

      this.setData({
        maternityResult: result,
        showMaternityResult: true
      });

      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '计算失败，请重试',
        icon: 'none'
      });
    }
  },

  resetMaternity() {
    const cities = this.data.cities;
    const resetData: any = {
      maternityStartDate: '',
      numberOfBabies: 1,
      babyCountIndex: 0,
      deliveryType: 'normal',
      hasExtendedDays: false,
      isMultipleBirth: false,
      isBreastFeeding: false,
      isFirstTimeBirth: false,
      additionalDystociaDays: 0,
      doctorRecommendDays: 0,
      miscarriageRuleIndex: 0,
      multipleIndex: 0,
      cityIndex: 0,
      maternityResult: null,
      showMaternityResult: false
    };
    
    if (cities.length > 0) {
      resetData.cityCode = cities[0].code;
      resetData.cityName = cities[0].chineseName;
    } else {
      resetData.cityCode = '';
      resetData.cityName = '';
    }
    
    this.setData(resetData);
  },

  async loadMiscarriageRules(cityCode: string) {
    if (!cityCode) return;
    
    this.setData({ loadingMiscarriageRules: true });
    
    try {
      const rules = await API.getMiscarriageRules(cityCode);
      const descriptions = rules.map(rule => rule.description);
      
      this.setData({
        miscarriageRules: rules,
        miscarriageRuleDescriptions: descriptions,
        miscarriageRuleIndex: 0,
        loadingMiscarriageRules: false
      });
    } catch (error) {
      console.error('加载流产规则失败:', error);
      this.setData({ loadingMiscarriageRules: false });
      
      wx.showToast({
        title: '加载流产规则失败',
        icon: 'none'
      });
    }
  },

  async loadCities() {
    try {
      wx.showLoading({ title: '加载城市列表...' });
      
      const cities = await API.getCities();
      const enabledCities = cities
        .filter(city => city.enabled)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      
      const cityNames = enabledCities.map(city => city.chineseName);
      
      this.setData({
        cities: enabledCities,
        cityNames,
        loadingCities: false
      });
      
      if (enabledCities.length > 0) {
        const firstCity = enabledCities[0];
        this.setData({
          cityCode: firstCity.code,
          cityName: firstCity.chineseName,
          cityIndex: 0
        });
        
        // 加载默认城市的流产规则
        this.loadMiscarriageRules(firstCity.code);
      }
      
      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      this.setData({ loadingCities: false });
      
      wx.showModal({
        title: '加载失败',
        content: '无法加载城市列表，请检查网络连接后重试',
        confirmText: '重试',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.loadCities();
          }
        }
      });
    }
  },

  // 津贴计算相关方法
  onGovTotalAmountInput(e: any) {
    this.setData({ govTotalAmount: e.detail.value });
  },

  onAvgSalaryBefore12MonthsInput(e: any) {
    this.setData({ avgSalaryBefore12Months: e.detail.value });
  },

  onBaseSalaryInput(e: any) {
    this.setData({ baseSalary: e.detail.value });
  },

  async calculateAllowance() {
    const { govTotalAmount, avgSalaryBefore12Months, baseSalary } = this.data;

    if (!govTotalAmount) {
      wx.showToast({ title: '请输入政府发放金额', icon: 'none' });
      return;
    }

    if (!avgSalaryBefore12Months) {
      wx.showToast({ title: '请输入产前12个月月平均工资', icon: 'none' });
      return;
    }

    if (!baseSalary) {
      wx.showToast({ title: '请输入基本工资', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '计算中...' });

    try {
      const result = await API.calculateAllowance({
        govTotalAmount: parseFloat(govTotalAmount),
        avgSalaryBefore12Months: parseFloat(avgSalaryBefore12Months),
        baseSalary: parseFloat(baseSalary)
      });

      this.setData({
        allowanceResult: result,
        showAllowanceResult: true
      });

      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '计算失败，请重试',
        icon: 'none'
      });
    }
  },

  resetAllowance() {
    this.setData({
      govTotalAmount: '',
      avgSalaryBefore12Months: '',
      baseSalary: '',
      allowanceResult: null,
      showAllowanceResult: false
    });
  },

  async onLoad() {
    this.loadCities();
  }
})
