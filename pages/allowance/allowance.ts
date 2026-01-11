import { API } from '../../utils/api';

Page({
  data: {
    govTotalAmount: '',
    avgSalaryBefore12Months: '',
    baseSalary: '',
    result: null,
    showResult: false
  },

  onGovTotalAmountInput(e: any) {
    this.setData({
      govTotalAmount: e.detail.value
    });
  },

  onAvgSalaryBefore12MonthsInput(e: any) {
    this.setData({
      avgSalaryBefore12Months: e.detail.value
    });
  },

  onBaseSalaryInput(e: any) {
    this.setData({
      baseSalary: e.detail.value
    });
  },

  async calculate() {
    const { govTotalAmount, avgSalaryBefore12Months, baseSalary } = this.data;

    if (!govTotalAmount) {
      wx.showToast({
        title: '请输入政府发放金额',
        icon: 'none'
      });
      return;
    }

    if (!avgSalaryBefore12Months) {
      wx.showToast({
        title: '请输入产前12个月月平均工资',
        icon: 'none'
      });
      return;
    }

    if (!baseSalary) {
      wx.showToast({
        title: '请输入基本工资',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '计算中...'
    });

    try {
      const result = await API.calculateAllowance({
        govTotalAmount: parseFloat(govTotalAmount),
        avgSalaryBefore12Months: parseFloat(avgSalaryBefore12Months),
        baseSalary: parseFloat(baseSalary)
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
      govTotalAmount: '',
      avgSalaryBefore12Months: '',
      baseSalary: '',
      result: null,
      showResult: false
    });
  }
})
