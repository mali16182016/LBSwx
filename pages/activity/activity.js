// pages/activity/activity.js
var util = require('../../utils/util.js');
Page({
  data: {
    content: '',
    pics: [],
    items: [{
        value: 'hot',
        name: '天气热'
      },
      {
        value: 'cold',
        name: '天气冷'
      },
      {
        value: 'niceday',
        name: '天气不错'
      },
      {
        value: 'wind',
        name: '刮风'
      },
      {
        value: 'rain',
        name: '下雨'
      },
      {
        value: 'snow',
        name: '下雪'
      }
    ],
    label: '',
  },

  onLoad: function(options) {
    var startActtime = options.time;
    console.log("活动开始时间：", startActtime);
    if (startActtime) {
      this.setData({
        startActtime: startActtime
      });
    }
  },

  input: function(e) { //输入content的
    this.setData({
      content: e.detail.value
    });
  },

  checkboxChange(e) { //标签发生修改
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var label = '';
    const items = this.data.items;
    const values = e.detail.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false;

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true;
          label += values[j];
          break;
        }
      }
    }
    this.setData({
      items
    });
    this.setData({
      label
    });
  },

  choose: function() { //这里是选取图片的方法
    var that = this;
    var pics = this.data.pics;
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        //图如果满了9张，不显示加图
        if (pics.length == 9) {
          that.setData({
            hideAdd: 1
          });
        } else {
          that.setData({
            hideAdd: 0
          });
        }
        that.setData({
          pics: pics
        });
      },
      fail: function() {
        console.log('上传失败');
      },
      complete: function() {
        // complete
      }
    });
  },
  chooseimage: function() { //备选的选图片方法
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function(res) {
        if (res.tempFilePaths.length > 0) {
          //图如果满了9张，不显示加图
          if (res.tempFilePaths.length == 9) {
            that.setData({
              hideAdd: 1
            });
          } else {
            that.setData({
              hideAdd: 0
            });
          }
          //把每次选择的图push进数组
          let pics = that.data.pics;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            pics.push(res.tempFilePaths[i]);
          }
          that.setData({
            pics: pics
          });
        }
      },
      fail: function(res) {
        console.log('上传失败');
      }
    });
  },

  send_act: function() { //发布按钮事件
    var that = this;
    var user_id = wx.getStorageSync('userid');
    if (that.data.pics.length) {
      console.log('图片不为空', that.data.pics);
    } else {
      console.log('图片为空');
    }
    if (that.data.pics.length && that.data.label && that.data.content) {
      wx.showLoading({
        title: '上传中',
      });
      that.img_upload();
      wx.navigateTo({
        url: '/pages/endactivity/endactivity?title=endactivity',
      });
    } else {
      wx.showToast({
        title: '您未添加图片，活动记录或者标签',
        icon: 'none',
        duration: 3000
      });
    }
  },

  img_upload: function() { //数据上传    
    let that = this;
    console.log('文字数据检测：', that.data.content, '标签数据检测:', that.data.label);
    let pics = that.data.pics;
    let pics_ok = [];
    var startActtime = that.data.startActtime;
    var endActtime = util.formatTime(new Date());
    console.log("活动开始&结束时间", startActtime, endActtime);
    this.setData({
      endActtime: endActtime
    });
    //由于图片只能一张一张地上传，所以用循环
    for (let i = 0; i < pics.length; i++) {
      wx.uploadFile({
        //路径填你上传图片方法的地址
        url: 'http://wechat.homedoctor.com/Moments/upload_do',
        filePath: pics[i],
        name: 'activity',
        formData: {
          'userId': wx.getStorageSync('userid')
        },
        success: function(res) {
          console.log('上传成功');
          //把上传成功的图片的地址放入数组中
          pics_ok.push(res.data);
          //如果全部传完，则可以将图片路径保存到数据库
          if (pics_ok.length == pics.length) {
            var userid = wx.getStorageSync('userid');
            var content = that.data.content;
            var label = that.data.label;
            wx.request({
              url: 'http://wechat.homedoctor.com/Moments/adds',
              data: {
                user_id: userid,
                images: pics_ok,
                content: content,
                label: label,
                startActtime: startActtime,
                endActtime: endActtime,
              },
              success: function(res) {
                if (res.data.status == 1) {
                  wx.hideLoading();
                  wx.showModal({
                    title: '提交成功',
                    showCancel: false,
                    success: function(res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/my_moments/my_moments',
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        },
        fail: function(res) {
          console.log('上传失败');
        }
      });
    }
  }
})