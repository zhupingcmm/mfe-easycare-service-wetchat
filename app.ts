interface IAppOption extends WechatMiniprogram.App {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo;
    hasUserInfo: boolean;
  };
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
  getUserInfo: () => Promise<WechatMiniprogram.UserInfo>;
}

App<IAppOption>({
  globalData: {
    userInfo: undefined,
    hasUserInfo: false
  },
  
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 检查是否已有用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.hasUserInfo = true
    }
  },
  
  getUserInfo(): Promise<WechatMiniprogram.UserInfo> {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo)
      } else {
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: (res) => {
            this.globalData.userInfo = res.userInfo
            this.globalData.hasUserInfo = true
            // 保存到本地存储
            wx.setStorageSync('userInfo', res.userInfo)
            resolve(res.userInfo)
          },
          fail: reject
        })
      }
    })
  }
})
