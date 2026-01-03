import { API } from '../../utils/api';

Page({
  data: {
    avgSalary: '',
    monthsWorked: '',
    socialSecurityBase: '',
    result: null,
    showResult: false
  },

  onAvgSalaryInput(e: any) {
    this.setData({
      avgSalary: e.detail.value
    });
  },

  onMonthsWorkedInput(e: any) {
    this.setData({
      monthsWorked: e.detail.value
    });
  },

  onSocialSecurityBaseInput(e: any) {
    this.setData({
      socialSecurityBase: e.detail.value
    });
  },

  async calculate() {
    const { avgSalary, monthsWorked, socialSecurityBase } = this.data;

    if (!avgSalary) {
      wx.showToast({
        title: '请输入平均工资',
        icon: 'none'
      });
      return;
    }

    if (!monthsWorked) {
      wx.showToast({
        title: '请输入缴费月数',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '计算中...'
    });

    try {
      const result = await API.calculateAllowance({
        avgSalary: parseFloat(avgSalary),
        monthsWorked: parseInt(monthsWorked),
        socialSecurityBase: socialSecurityBase ? parseFloat(socialSecurityBase) : 0
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
    this.setData({
      avgSalary: '',
      monthsWorked: '',
      socialSecurityBase: '',
      result: null,
      showResult: false
    });
  }
})
