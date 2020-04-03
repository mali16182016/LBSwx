var point = [];
var that;
var util = require('../../utils/util.js');
var countTooGetLocation = 0;
var total_micro_second = 0;
var starRun = 0;
var totalSecond = 0;
var oriMeters = 0.0;

function count_down(that) { //计时器
  if (starRun == 0) {
    return;
  }
  if (countTooGetLocation >= 1000) { //更新地址  每秒更新一次
    that.getLocation();
    that.drawline();
    that.gettime();
    countTooGetLocation = 0;
  }
  setTimeout(function () {
    countTooGetLocation += 10; //获取位置计时/频率
    total_micro_second += 10; //获取计时
    count_down(that);
  }, 10)
}

function getDistance(lat1, lng1, lat2, lng2) { //计算距离
  var dis = 0;
  var radLat1 = toRadians(lat1);
  var radLat2 = toRadians(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRadians(lng1) - toRadians(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;
  function toRadians(d) {
    return d * Math.PI / 180;
  }
}

Page({
  data: {
    clock: '',
    isLocation: false,
    latitude: 0,
    longitude: 0,
    markers: [],
    covers: [],
    meters: 0,
    polyline: [],
    region: [], //地理位置信息
    array: ['步行', '公交车', '地铁', '汽车', '火车', '自行车', '其他'],
    objectArray: [{
        id: 0,
        name: '步行'
      },
      {
        id: 1,
        name: '公交车'
      },
      {
        id: 2,
        name: '地铁'
      },
      {
        id: 3,
        name: '汽车'
      },
      {
        id: 4,
        name: '火车'
      },
      {
        id: 5,
        name: '自行车'
      },
      {
        id: 6,
        name: '其他'
      }
    ],
    index: 0,//默认步行
  },

  blindPickerChange(e) {
    console.log('当前交通方式', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },//获取栏中所选交通方式
  
  onLoad: function(options) {    
    console.log("onLoad----------");
    console.log("当前交通方式 0");
    this.getLocation()
    this.starRun()    
  },

  openLocation: function() {
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res) {
        wx.openLocation({
          latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
          longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
          scale: 28, // 缩放比例
        })
      },
    })
  },

  starRun: function() {
    if (starRun == 1) {
      return;
    }
    starRun = 1;
    count_down(this);//开始计时
    this.getLocation();//获取位置
  },

  drawline: function() {
    that.setData({
      polyline: [{
        points: point,
        color: "#99FF00",
        width: 4,
        dottedLine: false
      }],
    })
  }, // 划线工具（两时间点位置间划线）
  
  change: function() {
    starRun = 0;
    count_down(this);
  },//改变出行方式时，暂停计时（计时器用来控制获取位置信息的频率）
  
  stopRun: function() {
    starRun = 0;
    count_down(this);
    wx.navigateBack({
      delta: 1
    })
  },//到达，结束移行

  gettime: function() {
    var time = util.formatTime(new Date());
    console.log("time----------")
    console.log(time);
    this.setData({
      time: time
    })
  },//获取实时时间

  getLocation: function() {
    that = this
    var latitude1, longitude1
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res) {
        console.log("res----------")
        console.log(res)//显示位置信息

        var newCover = {
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: '/image/redPoint.png',
        };//在所处位置进行标记

        latitude1 = res.latitude
        longitude1 = res.longitude

        point.push({
          latitude: latitude1,
          longitude: longitude1
        })
        // console.log(point);//存入本位置，准备获取下一位置

        var oriCovers = that.data.covers;

        // console.log("oriMeters----------")
        // console.log(oriMeters);
        var len = oriCovers.length;
        var lastCover;
        if (len == 0) {
          oriCovers.push(newCover); //压栈
        }
        len = oriCovers.length;
        var lastCover = oriCovers[len - 1];

        // console.log("oriCovers----------")
        // console.log(oriCovers, len);

        var newMeters = getDistance(lastCover.latitude, lastCover.longitude, res.latitude, res.longitude) / 1000;
        if (newMeters < 0.0015) {
          newMeters = 0.0;
        }//过短距离移动，忽略不计

        oriMeters = oriMeters + newMeters;

        console.log("newMeters----------")
        console.log(newMeters);//上一时段里程（方面后期计算速度等）

        var meters = new Number(oriMeters);
        var showMeters = meters.toFixed(2);

        console.log("oriMeters----------")
        console.log(oriMeters);//更新里程

        oriCovers.push(newCover);

        that.setData({
          latitude: res.latitude,
          longitude: res.longitude, //位置信息
          // markers: [],
          covers: oriCovers, //轨迹
          meters: oriMeters, //里程数
        });
      },
    })
  }
})