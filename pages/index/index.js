// pages/index/index.js
import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图数据
    recommendList: [], //推荐歌单数据
    toplist: [] //排行榜数据
  },
  // 跳转到recommendSong页面的回调
  toRecommendSong(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取轮播图数据
    request({
      url: '/banner',
      data: {
        type: 2
      }
    }).then(res => {
      this.setData({
        bannerList: res.banners
      })
    })

    // 获取推荐歌单
    request({
      url: '/personalized',
      data: {
        limit: 10
      }
    }).then(res => {
      this.setData({
        recommendList: res.result
      })
    })


    //获取排行榜数据
    let index = 0
    let resultArr = []
    while (index < 5) {
      request({
        url: '/top/list',
        data: {
          idx: index++
        }
      }).then(res => {
        let topListItem = {
          name: res.playlist.name,
          tracks: res.playlist.tracks.slice(0, 3)
        }
        resultArr.push(topListItem)
        // 不需要等待五次请求全部结束才更新
        this.setData({
          toplist: resultArr
        })
      })
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