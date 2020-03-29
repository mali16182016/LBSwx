// pages/endactivity/endactivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  BacktoIndex: function() {
    wx.navigateBack({
      delta: 2
    });
  },

  BacktoAct: function() {
    wx.navigateBack({
      delta: 1
    });
  }
})