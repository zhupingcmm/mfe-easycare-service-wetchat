import { API, MaternityLeaveResponse, CityDO, MiscarriageRuleDO } from '../../utils/api';

Page({
  data: {
    cityCode: '',
    cityName: '',
    maternityStartDate: '',
    numberOfBabies: 1,
    deliveryType: 'normal',
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
    
    result: null as MaternityLeaveResponse | null,
    showResult: false
  },

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

  onIsBreastFeedingChange(e: any) {
    this.setData({ isBreastFeeding: e.detail.value });
  },

  onIsFirstTimeBirthChange(e: any) {
    this.setData({ isFirstTimeBirth: e.detail.value });
  },

  onAdditionalDystociaDaysInput(e: any) {
    this.setData({ additionalDystociaDays: parseInt(e.detail.value) || 0 });
  },

  onDoctorRecommendDaysInput(e: any) {
    this.setData({ doctorRecommendDays: parseInt(e.detail.value) || 0 });
  },

  async calculate() {
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

    if (numberOfBabies < 1) {
      wx.showToast({ title: '婴儿数量必须大于0', icon: 'none' });
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
        result,
        showResult: true
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

  reset() {
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
      result: null,
      showResult: false
    };
    
    // 重置为第一个城市
    if (cities.length > 0) {
      resetData.cityCode = cities[0].code;
      resetData.cityName = cities[0].chineseName;
    } else {
      resetData.cityCode = '';
      resetData.cityName = '';
    }
    
    this.setData(resetData);
  },

  async onLoad() {
    this.loadCities();
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
      
      // 过滤启用的城市并按排序序号排序
      const enabledCities = cities
        .filter(city => city.enabled)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      
      // 生成城市名称数组供 picker 使用
      const cityNames = enabledCities.map(city => city.chineseName);
      
      this.setData({
        cities: enabledCities,
        cityNames,
        loadingCities: false
      });
      
      // 设置默认选中第一个城市
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
  }
})
