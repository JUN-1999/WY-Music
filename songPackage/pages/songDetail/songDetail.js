import PubSub from 'pubsub-js'
import monment from 'moment'

import request from "../../../utils/request"
// pages/songDetail/songDetail.js
// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //音乐是否播放
    song: {},
    musicId: '', //音乐的id
    musicLink: '', //音乐的链接
    currentTime: '00:00', //当前时长
    durationTime: '00:00', //总时长
    currentWidth: 0, //实时播放的宽度
  },
  // 点击 播放/暂停 的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    let {
      musicId,
      musicLink
    } = this.data;
    this.musicControl(isPlay, musicId, musicLink)
  },
  // 发送请求获取音乐的详情数据
  async getMusicInfo(musicId) {
    let songData = await request({
      url: '/song/detail',
      data: {
        ids: musicId
      }
    })

    let durationTime = monment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    //动态修改窗口的标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })

  },
  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {

    if (isPlay) { //音乐播放
      if (!musicLink) {
        // 获取音乐的播放链接
        let musicLinkData = await request({
          url: '/song/url',
          data: {
            id: musicId
          }
        })
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        })
      }

      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name;
    } else { //暂停音乐
      this.backgroundAudioManager.pause();
    }
  },
  // 修改播放状态的功能函数
  changePlayState(isPlay) {
    // 修改音乐是否的状态
    this.setData({
      isPlay
    })
    // 修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 点击切歌的回调
  handleSwitch(e) {
    let type = e.currentTarget.id;
    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop()
    // 订阅来自recommendSong页面发布的musicId消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      console.log(musicId)
      // 获取音乐详情信息
      this.getMusicInfo(musicId);
      // 自动播放当前的音乐
      this.musicControl(true, musicId);
      // 取消订阅
      PubSub.unsubscribe('musicId')
    })
    // 发布消息数据给recommendSong页面
    PubSub.publish('switchType', type)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options:用于接收路由传参
    // console.log(JSON.parse(options.song))
    let musicId = options.musicId;
    this.setData({
      musicId
    })
    // 发送请求获取音乐的详情数据
    this.getMusicInfo(musicId)

    // 问题 ： 如果用户操作系统的控制音乐播放/暂停的按钮，页面不知道，导致页面显示是否播放的状态和真实的音乐播放器状态不一样
    // 解决方案：
    // 1.通过控制音频的实例  backgroundAudioManager  去监听音乐播放/暂停

    // 判断当前音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      // 修改当前页面的音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }
    // 监视音乐播放/暂停
    //创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监听音乐播放
    this.backgroundAudioManager.onPlay(() => {
      // 修改音乐是否播放的状态
      this.changePlayState(true)
      // 修改全局音乐播放的状态
      appInstance.globalData.musicId = musicId;
    })
    // 监听音乐暂停
    this.backgroundAudioManager.onPause(() => {
      // 修改音乐是否播放的状态
      this.changePlayState(false)
    })
    // 监听音乐停止
    this.backgroundAudioManager.onStop(() => {
      // 修改音乐是否播放的状态
      this.changePlayState(false)
    })
    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换到下一首音乐，并且自动播放
      PubSub.publish('switchType', 'next');
      // 将实时进度条还原为0
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    })
    //监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log('总时长', this.backgroundAudioManager.duration);
      // console.log('实时的时长', this.backgroundAudioManager.currentTime);
      // 格式化实时播放时间
      let currentTime = monment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      // 实时播放的宽度
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450
      // 更新实时时间
      this.setData({
        currentTime,
        currentWidth
      })

    })
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