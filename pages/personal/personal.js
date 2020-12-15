import request from "../../utils/request"

// pages/personal/personal.js
let startY = 0; //手指起始的坐标
let moveY = 0; //手机移动的坐标
let moveDistance = 0; //手指移动的距离

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: `translateY(0)`,
    coveTransition: '',
    userInfo: {}, //用户信息,
    recentPlayList: [] //用户播放记录
  },

  // 手指按住移动开始
  handleTouchStart(event) {
    this.setData({
      coveTransition: ''
    })
    // console.log(event.changedTouches[0].clientY)
    // 获取手指的起始坐标
    startY = event.changedTouches[0].clientY;
  },
  //手指按住开始移动
  handleTouchMove(event) {
    // 获取移动的坐标
    moveY = event.changedTouches[0].clientY;
    // 获取移动的距离
    moveDistance = moveY - startY;
    // console.log(moveDistance)
    // 判断
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    //动态更新coverTransform的状态值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  // 手指移动结束
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0)`,
      coveTransition: 'transform 0.3s linear'
    })
  },
  // 点击跳去登录
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  // 获取用户播放记录
  async getUserRecentPlayList(userId) {
    let recentPlayListData = await request({
      url: '/user/record',
      data: {
        uid: userId,
        type: 0
      }
    })
    let index = 0
    let recentPlayList = recentPlayListData.allData.slice(0, 10).map(item => {
      item.id = index++
      return item;
    })
    this.setData({
      recentPlayList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo')
    //console.log(userInfo);
    if (userInfo) {
      // 更新userInfo的状态
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
      // 获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
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