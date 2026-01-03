import { API, MaternityLeaveResponse, CityDO } from '../../utils/api';

Page({
  data: {
    activeTab: 'maternity',
    
    // 产假计算相关
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
    maternityResult: null as MaternityLeaveResponse | null,
    showMaternityResult: false,
    
    // 津贴计算相关
    avgSalary: '',
    socialSecurityBase: '',
    monthsWorked: '',
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

  async calculateMaternity() {
    const { cityCode, expectedDeliveryDate, numberOfBabies, hasExtendedDays, isDifficultBirth, isMultipleBirth, isMiscarriage, isBreastFeeding, isFirstTimeBirth, additionalDystociaDays, doctorRecommendDays } = this.data;

    if (!cityCode) {
      wx.showToast({ title: '请选择城市', icon: 'none' });
      return;
    }

    if (!expectedDeliveryDate) {
      wx.showToast({ title: '请选择预产期', icon: 'none' });
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
  },

  // 津贴计算相关方法
  onAvgSalaryInput(e: any) {
    this.setData({ avgSalary: e.detail.value });
  },

  onSocialSecurityBaseInput(e: any) {
    this.setData({ socialSecurityBase: e.detail.value });
  },

  onMonthsWorkedInput(e: any) {
    this.setData({ monthsWorked: e.detail.value });
  },

  async calculateAllowance() {
    const { avgSalary, socialSecurityBase, monthsWorked } = this.data;

    if (!avgSalary) {
      wx.showToast({ title: '请输入平均工资', icon: 'none' });
      return;
    }

    if (!monthsWorked) {
      wx.showToast({ title: '请输入缴费月数', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '计算中...' });

    try {
      const result = await API.calculateAllowance({
        avgSalary: parseFloat(avgSalary),
        monthsWorked: parseInt(monthsWorked),
        socialSecurityBase: socialSecurityBase ? parseFloat(socialSecurityBase) : parseFloat(avgSalary)
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
      avgSalary: '',
      socialSecurityBase: '',
      monthsWorked: '',
      allowanceResult: null,
      showAllowanceResult: false
    });
  },

  async onLoad() {
    await this.loadCities();
  }
})
