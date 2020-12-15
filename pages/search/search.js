// pages/search/search.js
import request from '../../utils/request'
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder内容
    hotList: [], //热搜榜数据
    searchContent: '', //用户输入的表单项数据
    searchList: [], //关键字模糊匹配的数据
    historyList: [], //历史搜索记录
  },
  // 获取初始化的数据--搜索默认值--热搜榜数据
  async getInitData() {
    // 搜索默认值
    let placeholderData = await request({
      url: '/search/default',
      data: {
        isLogin: false
      }
    })
    // 热搜榜数据
    let hotListData = await request({
      url: '/search/hot/detail',
      data: {
        isLogin: false
      }
    })
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
  },
  // 获取搜索数据的功能函数
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return;
    }
    let {
      searchContent,
      historyList
    } = this.data;
    // 发送请求获取关键字模糊匹配数据
    let searchListData = await request({
      url: '/search',
      data: {
        keywords: searchContent,
        limit: 10
      }
    })
    this.setData({
      searchList: searchListData.result.songs
    })
    // 将搜索的关键字添加到搜索历史记录中
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList)
  },
  // 表单项内容发送改变的回调
  handleInputChange(event) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      // 发送请求获取关键字的模糊匹配
      this.setData({
        searchContent: event.detail.value.trim()
      })
      this.getSearchList();
    }, 300);

  },
  // 获取本地历史记录的功能函数
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },
  // 清空搜索内容
  clearSearchContent() {
    this.setData({
      searchContent: [],
      searchList: []
    })
  },
  // 删除搜索历史记录
  deleteSearchHistory() {
    wx.showModal({
      content: '确定删除吗',
      success: (res) => {
        // console.log(res)
        if (res.confirm) {
          // 清空data中的historyList
          this.setData({
            historyList: []
          })
          // 删除本地历史记录
          wx.removeStorageSync('searchHistory')
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始化的数据--搜索默认值
    this.getInitData()
    //获取历史记录
    this.getSearchHistory()
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