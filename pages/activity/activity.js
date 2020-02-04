// pages/activity/activity.js
Page({
  data: {
    items: [
      { value: 'hot', name: '天气热' },
      { value: 'cold', name: '天气冷', checked: 'true' },
      { value: 'niceday', name: '天气不错' },
      { value: 'wind', name: '刮风' },
      { value: 'rain', name: '下雨' },
      { value: 'snow', name: '下雪' }
    ],
    pics: [],
    img_url: [],
    content: ''
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'view',
      path: 'page/component/pages/view/view'
    }
  },

  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    const items = this.data.items
    const values = e.detail.value
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }

    this.setData({
      items
    })
  },

  choose: function () {//这里是选取图片的方法
    var that = this,
    pics = this.data.pics;  
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        //图如果满了9张，不显示加图
        if (pics.length == 9) {
          that.setData({
            hideAdd: 1
          })
        } else {
          that.setData({
            hideAdd: 0
          })
        }
        that.setData({
          pics: pics
        });
      },
      fail: function () {
        // fail        
      },
      complete: function () {
        // complete
      }
    })
  },
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          //图如果满了9张，不显示加图
          if (res.tempFilePaths.length == 9) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })
        }
      },
      fail: function (res) {
        console.log('上传失败')
      }
    })
  },

})