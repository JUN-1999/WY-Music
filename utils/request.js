import {
  mobileHost
} from './config'

// 发送Ajax请求
export default (options) => {
  return new Promise((resolve, rejects) => {
    wx.request({
      url: mobileHost + options.url,
      data: options.data || {},
      method: options.method || 'GET',
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        if (options.data.isLogin) { //此为登录请求
          // 将用户的cookie存入本地
          wx.setStorage({
            data: res.cookies,
            key: 'cookies',
          })
        }
        resolve(res.data)
      },
      fail: (err) => {
        rejects(err)
      }
    })
  })

}