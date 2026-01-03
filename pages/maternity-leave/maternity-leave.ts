import { API, MaternityLeaveResponse, CityDO } from '../../utils/api';

Page({
  data: {
    cityCode: '',
    cityName: '',
    expectedDeliveryDate: '',
    numberOfBabies: 1,
    hasExtendedDays: false,
    isDifficultBirth: false,
    isMultipleBirth: false,
    isMiscarriage: false,
    isBreastFeeding: false,
    isFirstTimeBirth: false,
    additionalDystociaDays: 0,
    doctorRecommendDays: 0,
    
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
      this.setData({
        cityIndex: index,
        cityCode: cities[index].code,
        cityName: cities[index].chineseName
      });
    }
  },

  onExpectedDeliveryDateChange(e: any) {
    this.setData({ expectedDeliveryDate: e.detail.value });
  },

  onNumberOfBabiesChange(e: any) {
    const index = e.detail.value;
    const value = this.data.babyCountOptions[index];
    this.setData({
      babyCountIndex: index,
      numberOfBabies: value,
      isMultipleBirth: value > 1
    });
  },

  onHasExtendedDaysChange(e: any) {
    this.setData({ hasExtendedDays: e.detail.value });
  },

  onIsDifficultBirthChange(e: any) {
    this.setData({ isDifficultBirth: e.detail.value });
  },

  onIsMiscarriageChange(e: any) {
    this.setData({ isMiscarriage: e.detail.value });
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
    const { cityCode, expectedDeliveryDate, numberOfBabies, hasExtendedDays, isDifficultBirth, isMultipleBirth, isMiscarriage, isBreastFeeding, isFirstTimeBirth, additionalDystociaDays, doctorRecommendDays } = this.data;

    if (!cityCode) {
      wx.showToast({ title: '请选择城市', icon: 'none' });
      return;
    }

    if (!expectedDeliveryDate) {
      wx.showToast({ title: '请选择预产期', icon: 'none' });
      return;
    }

    if (numberOfBabies < 1) {
      wx.showToast({ title: '婴儿数量必须大于0', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '计算中...' });

    try {
      const result = await API.calculateMaternityLeave({
        cityCode,
        expectedDeliveryDate,
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
      expectedDeliveryDate: '',
      numberOfBabies: 1,
      babyCountIndex: 0,
      hasExtendedDays: false,
      isDifficultBirth: false,
      isMultipleBirth: false,
      isMiscarriage: false,
      isBreastFeeding: false,
      isFirstTimeBirth: false,
      additionalDystociaDays: 0,
      doctorRecommendDays: 0,
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
    await this.loadCities();
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
        this.setData({
          cityCode: enabledCities[0].code,
          cityName: enabledCities[0].chineseName,
          cityIndex: 0
        });
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
