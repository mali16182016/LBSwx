//index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    movingInfo: {
      title: '开始移行'
    },
    actingInfo: {
      title: '开始活动'
    }
  },

  MoveBtn: function() {
    var startMovetime = util.formatTime(new Date());
    wx.navigateTo({
      url: '/pages/move/move?time='+startMovetime,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
  },
  ActBtn: function() {
    var startActtime = util.formatTime(new Date());
    wx.navigateTo({
      url: '/pages/activity/activity?time='+startActtime,
    });
  }
})