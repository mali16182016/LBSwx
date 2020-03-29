//index.js
const app = getApp()
Page({
  data: {    
    movingInfo: {
      title: '移行中'
    },
    actingInfo: {
      title: '活动中'
    }
  },
  
  MoveBtn:function(){
    wx.navigateTo({
      url: '/pages/move/move?title=move',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  ActBtn:function(){
    wx.navigateTo({
      url: '/pages/activity/activity?title=activity',
    })
  }
})
