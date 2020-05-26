var change_res=[]
var all_res=[]
var way=[]
var change_time=[]
var all_time=[]
//var startRun=0
//var stopRun=1
var timer
Page({
  data: {
    //位置相关设置
    latitude: 0,
    longitude: 0,
    isLocation: false,
    //出行方式设置
    array: ['步行', '公交车', '地铁', '汽车', '火车', '自行车', '其他'],
    index: '',
    //时间设置
    //轨迹设置
    markers: [],
    polyline:[],
    hasMakers: false,
  },

  setTime() {
    let that = this
    timer = setInterval(function(){
      that.getTime()
      var res = []
      var oriCovers = that.data.markers;
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          console.log("位置信息为：", res)//显示位置信息
          all_res.push({
            latitude: res.latitude,
            longitude: res.longitude
          })
          console.log("位置集：", all_res)
          var newCover = {
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '/image/redPoint.png',
          };//在所处位置进行标记
          // markers.push(newCover);
          oriCovers.push(newCover);
          console.log("cover集：", oriCovers)
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            markers: oriCovers,
            hasMakers: true,
            polyline: [{
              points: all_res,
              color: "#99FF00",
              width: 4,
            }], //轨迹
          })
        }
      })
    
    } ,5000)
  },//计时器 周期运行函数

  onLoad:function(){
    let that = this
    wx.getLocation({
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
    })
  },

  blindPickerChange(e) {
    console.log('交通方式为：', e.detail.value)
    way.push(e.detail.value)//获取方式
    var util = require('../../utils/util.js')
    var time = util.formatTime(new Date());
    console.log("change点时间为", time)
    change_time.push(time)
    console.log("change_time记录：",change_time)//获取时间
    var latitude, longitude
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log("chang点位置为：", res)//显示位置信息
        change_res.push({
          latitude: res.latitude,
          longitude: res.longitude
        })
        console.log("change_res记录：", change_res)
      }
    })//获取位置
    this.setData({
      index: e.detail.value
    })
    clearInterval(timer);
    this.setTime();

    // if (starRun == 1) {
    //   return;
    // }
    // starRun = 1;
    // count_down(this);//开始计时

  },//更改交通方式

  getTime: function () {
    var util = require('../../utils/util.js')
    var time = util.formatTime(new Date());
    console.log("此刻时间为",time)
    // return time
    all_time.push(time)
    console.log("时间集", all_time)
  },//获取实时时间

  change:function(){
    clearInterval(timer);
  },//移行状态改变

  stopRun: function () {
    let that = this;
    clearInterval(timer);
    console.log("结束记录");
    wx.showLoading({
      title: '上传中',
    });
    that.data_upload();
    wx.navigateBack({
      delta: 1
    });
  },//完成移行

  data_upload:function(){
    let that = this;
    var userid = wx.getStorageSync('userid');
    wx.request({
      url: 'http://wechat.homedoctor.com/move/adds',
      data:{
        user_id: userid,
        changeres: change_res,
        changetime: change_time,
        allres: all_res,
        alltime: all_time,
        changeway: way,
      },
      success: function(res) {
        if (res.data.status == 1) {
          wx.hideLoading();
          wx.showModal({
            title: '提交成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        }
      },
    })
  }, 
})