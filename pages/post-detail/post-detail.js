// pages/post-detail/post-detail.js
import {postList} from '../../data/data.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData:{},
    _pid:null,
    isPlaying:false,
    collected:false,
    _postsCollected:{}
  },
  currentMusicIsPlaying(){
    if(app.gIsPlayingPostId == this.data._pid&&app.gIsPlayingMusic){
      return true
    }
    return false
  },
  onMusicStart(){
    const mgr = wx.getBackgroundAudioManager()
    mgr.src = postList[this.data._pid].music.url
    mgr.title = postList[this.data._pid].music.title
    mgr.coverImgUrl = postList[this.data._pid].music.coverImg

    mgr.play()
    app.gIsPlayingMusic = true
    app.gIsPlayingPostId = this.data._pid

    this.setData({
      isPlaying:true
    })
  },
  onMusicStop(){
    const mgr = wx.getBackgroundAudioManager()
    mgr.pause()
    app.gIsPlayingMusic = false
    app.gIsPlayingPostId = -1
    this.setData({
      isPlaying:false
    })
  },
  async onShare(){
    const result = await wx.showActionSheet({
      itemList: ['分享到QQ','分享到微信','分享到微博'],
    })
    console.log(result)
  },
  onCollect(event){
    // 假设为收藏
    const postsCollected= this.data._postsCollected
    postsCollected[this.data._pid] = !this.data.collected
    this.setData({
      collected:!this.data.collected
    })
    wx.setStorageSync('posts_collected', postsCollected)

    wx.showToast({
      title: this.data.collected?'收藏成功':'取消成功',
      duration:3000
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const postData = postList[options.pid]
    const postsCollected = wx.getStorageSync('posts_collected')
    this.data._pid = options.pid
    this.data._postsCollected = postsCollected
    let collected = postsCollected[this.data._pid]
    if(collected==undefined){
      collected = false;
    }
    this.setData({
      postData,
      collected,
      isPlaying:this.currentMusicIsPlaying()
    })

    const mgr = wx.getBackgroundAudioManager()
    this.data._mgr = mgr
    mgr.onPlay(this.onMusicStart)
    mgr.onPause(this.onMusicStop)
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