// 登录流程
// 1.手机表单项数据
// 2.前端验证
// 1.验证用户的信息（账户密码）是否合法
// 2.前端验证不通过就提示用户，不需要发请求给后端
//3.前端验证通过了，发请求（携带账号，密码）给服务器端
// 3.后端验证
// 1.验证用户是否存在
// 2.用户不存在  直接返回，告诉前端用户不存在
// 3.用户存在需要验证密码是否正确
// 4.密码不正确，返回给前端提示密码不正确
// 5.密码正确返给前端数据，提示用户登录成功（携带用户数据）

import request from '../../utils/request'

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', //手机号
    password: ''//密码
  },
  // 表单项发生变化的对象
  handleInput(e) {
    let type = e.currentTarget.id;
    this.setData({
      [type]: e.detail.value
    })
  },
  // 登录的回调
  async login() {
    // 1.收集表单项数据
    let {
      phone,
      password
    } = this.data;
    // 2.前端验证
    // 手机验证场景
    // 1.为空 2.格式不正确 3.格式正确
    if (!phone) {
      //提示用户手机号不能为空
      wx.showToast({
        title: '手机号不能为空',
        icon: "none"
      })
      return
    }
    // 定义正则表达式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!phoneReg.test(phone)) {
      //提示手机号不正确用户
      wx.showToast({
        title: '手机号格式不正确',
        icon: "none"
      })
      return
    }

    if (!password) {
      //提示用户密码不能为空
      wx.showToast({
        title: '密码不能为空',
        icon: "none"
      })
      return
    }

    //后端验证
    let res = await request({
      url: '/login/cellphone',
      data: {
        phone,
        password,
        isLogin: true
      }
    })
    if (res.code == 200) {
      wx.showToast({
        title: '登陆成功',
      })
      // 将用户的信息存储至本地
      wx.setStorageSync('userInfo', JSON.stringify(res.profile))
      // 跳转至个人中心 personal 页面
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    } else if (res.code === 400) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    } else if (res.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '登陆失败，请重新登录',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})