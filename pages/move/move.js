// var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
// var qqmapsdk;
var point = [];
var that;

var util = require('../../utils/util.js');


var countTooGetLocation = 0;
var total_micro_second = 0;
var starRun = 0;
var totalSecond = 0;
var oriMeters = 0.0;
/* 毫秒级倒计时 */
function count_down(that) {             //计时器

   if (starRun == 0) {
      return;
   }

  //  if (countTooGetLocation >= 100) {     //更新时间  100*10=1000=1s
  //     var time = date_format(total_micro_second);      //够1s就更新时间显示
  //     that.updateTime(time);
  //  }

   if (countTooGetLocation >= 1000) {   //更新地址  每秒更新一次
      that.getLocation();
      that.drawline();
      that.gettime();
      countTooGetLocation = 0; 

    //  var time = util.formatTime(new Date());
    //  console.log("time----------")
    //  console.log(time);
    //  this.setData({
    //    time: time
    //  })     
       //每够1s更新一下位置
   }


 setTimeout
    setTimeout(function () {
    countTooGetLocation += 10;   //获取位置计时/频率
    total_micro_second += 10;    //获取计时
    count_down(that);
    }
    , 10
  )
}



// // 时间格式化输出，如03:25:19 86。每10ms都会调用一次
// function date_format(micro_second) {
//   // 秒数
//     var second = Math.floor(micro_second / 1000);
//   // 小时位
//     var hr = Math.floor(second / 3600);
//   // 分钟位
//     var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
//   // 秒位
//   var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;


//   return hr + ":" + min + ":" + sec + " ";
// },


function getDistance(lat1, lng1, lat2, lng2) {    //获取里程数
    var dis = 0;
    var radLat1 = toRadians(lat1);
    var radLat2 = toRadians(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRadians(lng1) - toRadians(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;

    function toRadians(d) { return d * Math.PI / 180; }
}

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

//****************************************************************************************
//****************************************************************************************


Page({
  data: {
    // point: {
    //   // latitude: 39.749167,
    //   // longitude: 116.277778,
    // },


    clock: '',
    isLocation: false,
    latitude: 0,
    longitude: 0,
    markers: [],
    covers: [],
    meters: 0.00,
    // time: "0:00:00",
    polyline:[],
     

    region: [],  //地理位置信息
    markers: [],
    // items: [
    //   { value: 'walk', name: '步行' },
    //   { value: 'bus', name: '公交车', checked: 'true' },
    //   { value: 'subway', name: '地铁' },
    //   { value: 'car', name: '汽车' },
    //   { value: 'train', name: '火车' },
    //   { value: 'bike', name: '自行车' },
    //   { value: 'others', name: '其他'}
    // ]    //单选


    //从底部弹起的滚动选择器
    array: ['步行','公交车','地铁','汽车','火车','自行车','其他'],
    objectArray: [
      {
        id:'walk',
        name:'步行'
      },
      {
        id: 'bus',
        name:'公交车'
      },
      {
        id:'subway',
        name:'地铁'
      },
      {
        id: 'car',
        name:'汽车'
      },
      {
        id: 'train',
        name: '火车'
      },
      {
        id: 'bike',
        name: '自行车'
      },
      {
        id: 'els',
        name: '其他'
      }
    ],
    // index: 'walk',
  },

  // radioChange(e) {
  //   console.log('改变交通方式：', e.detail.value)

  //   const items = this.data.items
  //   const values = e.detail.value
  //   for (let i = 0, lenI = items.length; i < lenI; ++i) {
  //     items[i].checked = false

  //     for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
  //       if (items[i].value === values[j]) {
  //         items[i].checked = true
  //         break
  //       }
  //     }
  //   }

  //   this.setData({
  //     items
  //   })
  // },

  blindPickerChange(e) {
    console.log('当前交通方式', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },


  // //精确定位版
  // onLoad: function (options) {
  //   let that = this;
  //   // 引入腾讯地图
  //   let qqmapsdk = new QQMapWX({
  //     key: 'FXWBZ-W47EW-JO7RV-RGO47-JOJOK-E7BTW' // 必填
  //   });
  //   // 使用 wx.createMapContext 获取 map 上下文
  //   that.mapCtx = wx.createMapContext('myMap');
  //   wx.getLocation({
  //     // 国内只能使用gcj02坐标系，wgs84不能使用；高德地图等都是使用的gcj02
  //     type: "gcj02",
  //     success: function (res) {
  //       that.setData({
  //         latitude: res.latitude,
  //         longitude: res.longitude
  //       })
  //       qqmapsdk.reverseGeocoder({
  //         location: {
  //           latitude: that.data.latitude,
  //           longitude: that.data.longitude
  //         },
  //         success: function (res) {
  //           console.log(res);
  //           that.setData({
  //             province: res.result.ad_info.province,
  //             city: res.result.ad_info.city,
  //             latitude: that.data.latitude,
  //             longitude: that.data.longitude
  //           })
  //         },
  //         fail: function (res) {
  //           console.log(res);
  //         }
  //       });
  //     }
  //   })
  //   // 将地理坐标精确到小数点后七位
  //   let latitude = Number(options.latitude).toFixed(7);
  //   let longitude = Number(options.longitude).toFixed(7);

  //   that.data.info.latitude = latitude;
  //   that.data.info.longitude = longitude;

  //   that.setData({
  //     info: info
  //   })
  //  }


  //悦跑圈版
  //****************************

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getLocation()
    this.starRun()
    console.log("onLoad")
    // count_down(this);

    // var time = util.formatTime(new Date());
    // console.log("time----------")
    // console.log(time);              
    // this.setData({
    //   time: time
    // })

  },

  //****************************
  openLocation: function () {
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        wx.openLocation({
          latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
          longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
          scale: 28, // 缩放比例
        })
      },
    })
  },

  //****************************
  starRun: function () {
    if (starRun == 1) {
      return;
    }
    starRun = 1;
    count_down(this);
    this.getLocation();
    console.log('当前交通方式', 0)
    // this.drawline();
    // if(){
    //   wx.showToast({
    //     title:'请选择出行方式',
    //     icon:'choose',
    //     duration:1000,
    //     mask:true
    //   })
    // }
    
  },


  drawline: function () { 
    that.setData({ 
      polyline: [{ 
        points: point, 
        color: "#99FF00", 
        width: 4, 
        dottedLine: false 
        }], 
      }) 
    },                           // 划线



  //****************************
  change: function () {
    starRun = 0;
    count_down(this);
  },


  //****************************
  stopRun: function () {
    starRun = 0;
    count_down(this);
  },


  //****************************
  // updateTime: function (time) {

  //   var data = this.data;
  //   data.time = time;
  //   this.data = data;

  //   console.log("time----------")
  //   console.log(time);               //后台显示时间

  //   this.setData({
  //     time: time,
  //   })

  // },
  gettime: function() {
    var time = util.formatTime(new Date());
    console.log("time----------")
    console.log(time);
    this.setData({
      time: time
    })     
  },
//****************************
  getLocation: function () {
    that = this
    var latitude1, longitude1
    wx.getLocation({

      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log("res----------")
        console.log(res)

        
        //make datas 
        var newCover = {
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: '/image/redPoint.png',
        };

        latitude1 = res.latitude
        longitude1 = res.longitude

        point.push({ latitude: latitude1, longitude: longitude1 })
        console.log(point);

        var oriCovers = that.data.covers;

        console.log("oriMeters----------")
        console.log(oriMeters);
        var len = oriCovers.length;
        var lastCover;
        if (len == 0) {
          oriCovers.push(newCover);          //压栈
        }
        len = oriCovers.length;
        var lastCover = oriCovers[len - 1];

        console.log("oriCovers----------")
        console.log(oriCovers, len);

        var newMeters = getDistance(lastCover.latitude, lastCover.longitude, res.latitude, res.longitude) / 1000;

        if (newMeters < 0.0015) {
          newMeters = 0.0;
        }

        // if(newMeters){
        //   drawline();
        // }                             //当位移距离有效（大于一定阈值时）生效

        oriMeters = oriMeters + newMeters;
        console.log("newMeters----------")
        console.log(newMeters);


        var meters = new Number(oriMeters);
        var showMeters = meters.toFixed(2);

        oriCovers.push(newCover);

        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,       //位置信息
          markers: [],
          covers: oriCovers,              //轨迹
          meters: showMeters,             //里程数
        });
      },
    })
  }

})