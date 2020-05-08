var util = require('../../utils/util.js')
var that
var change_res=[]
var all_res=[]
var oriCovers = []
var way=[]
var change_time=[]
var all_time=[]
var startRun=0
var stopRun=1
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
    hasMakers: false
    },

  setTime() {
    that = this
    timer = setInterval(function(){
      that.getTime()
      var res = []
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
          var oriCovers = that.data.markers;
          oriCovers.push(newCover);
          console.log("cover集：", oriCovers)
        }
      })
    that.setData({
      latitude: res.latitude,
      longitude: res.longitude,
      markers: oriCovers,
      hasMakers:true,
      polyline: [{
        points: all_res,
        color: "#99FF00",
        width: 4,
      }], //轨迹
    })
    } ,5000)
  },//计时器 周期运行函数

  blindPickerChange(e) {
    console.log('交通方式为：', e.detail.value)
    way.push(e.detail.value)//获取方式
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
    this.setTime()

    // if (starRun == 1) {
    //   return;
    // }
    // starRun = 1;
    // count_down(this);//开始计时

  },//更改交通方式

  getTime: function () {
    var time = util.formatTime(new Date());
    console.log("此刻时间为",time)
    // return time
    all_time.push(time)
    console.log("时间集", all_time)
  },//获取实时时间

  // getres:function(){
  //   that = this
  //   var latitude1, longitude1
  //   var res = []
  //   var all_res = []
  //   var oriCovers = []
  //   wx.getLocation({
  //     type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
  //     success: function (res) {
  //       console.log("位置信息为：", res)//显示位置信息
  //       var longitude1 = res.longitude
  //       var latitude1 = res.latitude
  //       that.all_res.push({
  //         latitude: latitude1,
  //         longitude: longitude1
  //       })
  //       console.log("位置集：", all_res)
  //       var newCover = {
  //         latitude: latitude1,
  //         longitude: longitude1,
  //         iconPath: '/image/redPoint.png',
  //       };//在所处位置进行标记
  //       var oriCovers = that.data.covers;
  //       that.oriCovers.push(newCover);
  //     }
  //   })
  //   that.setData({
  //     latitude: res.latitude,
  //     longitude: res.longitude,
  //     markers: oriCovers,
  //     polyline: [{
  //       points: all_res,
  //       color: "#99FF00",
  //       width: 4,
  //     }], //轨迹
  //   })
  // },

  change:function(){
    clearInterval(timer);
    // starRun = 0;
    // count_down(this);
  },//移行状态改变

  stopRun: function () {
    clearInterval(timer);
    // starRun = 0;
    // stopRun=0;
    // count_down(this);
    console.log("结束记录")
  }//完成移行
})

// var point = [];
// var that;
// var util = require('../../utils/util.js');
// var countTooGetLocation = 0;
// var total_micro_second = 0;
// var starRun = 0;
// var totalSecond = 0;
// var oriMeters = 0.0;

// function count_down(that) { //计时器
//   if (starRun == 0) {
//     return;
//   }
//   if (countTooGetLocation >= 1000) { //更新地址  每秒更新一次
//     that.getLocation();
//     that.drawline();
//     that.gettime();
//     countTooGetLocation = 0;
//   }
//   setTimeout(function () {
//     countTooGetLocation += 10; //获取位置计时/频率
//     total_micro_second += 10; //获取计时
//     count_down(that);
//   }, 10)
// }

// function getDistance(lat1, lng1, lat2, lng2) { //计算距离
//   var dis = 0;
//   var radLat1 = toRadians(lat1);
//   var radLat2 = toRadians(lat2);
//   var deltaLat = radLat1 - radLat2;
//   var deltaLng = toRadians(lng1) - toRadians(lng2);
//   var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
//   return dis * 6378137;
//   function toRadians(d) {
//     return d * Math.PI / 180;
//   }
// }

// Page({
//   data: {
//     clock: '',
//     isLocation: false,
//     latitude: 0,
//     latds:[],
//     longitude: 0,
//     lgtds:[],
//     markers: [],
//     covers: [],
//     meters: 0,
//     polyline: [],
//     region: [], //地理位置信息
//     array: ['步行', '公交车', '地铁', '汽车', '火车', '自行车', '其他'],
//     index: '',
//     i:''
//   },

//   blindPickerChange(e) {
//     console.log('Picker发生change事件，携带value值为：', e.detail.value)
//     this.setData({
//       index: e.detail.value
//     })
//   },//获取栏中所选交通方式
  
//   // onLoad: function(options) {    
//   //   console.log("onLoad----------");
//   //   console.log("当前交通方式:walk");
//   //   this.getLocation()
//   //   this.starRun()    
//   // },

//   openLocation: function() {
//     wx.getLocation({
//       type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
//       success: function(res) {
//         wx.openLocation({
//           latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
//           longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
//           scale: 28, // 缩放比例
//         })
//       },
//     })
//   },

//   starRun: function() {
//     if (starRun == 1) {
//       return;
//     }
//     starRun = 1;
//     // if (i ==''){
//     //   console.log("未选择出行方式");
//     // } 
//     count_down(this);//开始计时
//     this.getLocation();//获取位置
//   },

//   drawline: function() {
//     that.setData({
//       polyline: [{
//         points: point,
//         color: "#99FF00",
//         width: 4,
//         dottedLine: false
//       }],
//     })
//   }, // 划线工具（两时间点位置间划线）
  
//   change: function() {
//     starRun = 0;
//     count_down(this);
//   },//改变出行方式时，暂停计时（计时器用来控制获取位置信息的频率）
  
//   stopRun: function() {
//     starRun = 0;
//     count_down(this);
//     let that = this;
//     console.log('文字数据检测：', that.data.content, '标签数据检测:', that.data.label);
//     let latds = that.data.latds;
//     let lgtds = that.data.lgtds;
//     let la_ok = [];
//     let lg_ok = [];
//     wx.uploadFile({
//       url: 'http://wechat.homedoctor.com/Moments/moves/latitudes',
//       filePath:latitudes[],
//       var userid =  wx.getStorageSync('userid');
//       var time = that.data.time;
//       var index = that.data.index;
//       wx.request({
//         url: 'http://wechat.homedoctor.com/Moments/adds',
//         data: {
//           user_id: userid,
//           latitudes: pics_ok,
//           time:time,
//           index:index,
//         },
//         success: function (res) {
//           if (res.data.status == 1) {
//             wx.hideLoading();
//             wx.showModal({
//               title: '提交成功',
//               showCancel: false,
//               success: function (res) {
//                 if (res.confirm) {
//                   wx.navigateTo({
//                     url: '/pages/my_moments/my_moments',
//                   });
//                 }
//               }
//             });
//           }
//         }
//       });
//   },
//     fail: function (res) {
//       console.log('上传失败');
//     }
//   });
//     wx.navigateBack({
//       delta: 1
//     })
//   },//到达，结束移行,返回上一界面

//   gettime: function() {
//     var time = util.formatTime(new Date());
//     console.log("time----------")
//     console.log(time);
//     this.setData({
//       time: time
//     })
//   },//获取实时时间

//   getLocation: function() {
//     that = this
//     var latitude1, longitude1
//     wx.getLocation({
//       type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
//       success: function(res) {
//         console.log("res----------")
//         console.log(res)//显示位置信息

//         var newCover = {
//           latitude: res.latitude,
//           longitude: res.longitude,
//           iconPath: '/image/redPoint.png',
//         };//在所处位置进行标记

//         latitude1 = res.latitude
//         longitude1 = res.longitude

//         point.push({
//           latitude: latitude1,
//           longitude: longitude1
//         })
//         // console.log(point);//存入本位置，准备获取下一位置

//         var oriCovers = that.data.covers;

//         // console.log("oriMeters----------")
//         // console.log(oriMeters);
//         var len = oriCovers.length;
//         var lastCover;
//         if (len == 0) {
//           oriCovers.push(newCover); //压栈
//         }
//         len = oriCovers.length;
//         var lastCover = oriCovers[len - 1];

//         // console.log("oriCovers----------")
//         // console.log(oriCovers, len);

//         var newMeters = getDistance(lastCover.latitude, lastCover.longitude, res.latitude, res.longitude) / 1000;
//         if (newMeters < 0.0015) {
//           newMeters = 0.0;
//         }//过短距离移动，忽略不计

//         oriMeters = oriMeters + newMeters;

//         console.log("newMeters----------")
//         console.log(newMeters);//上一时段里程（方面后期计算速度等）

//         var meters = new Number(oriMeters);
//         var showMeters = meters.toFixed(2);

//         console.log("oriMeters----------")
//         console.log(oriMeters);//更新里程

//         oriCovers.push(newCover);

//         that.setData({
//           latitude: res.latitude,
//           longitude: res.longitude, //位置信息
//           markers: [],
//           covers: oriCovers, //轨迹
//           meters: oriMeters, //里程数
//         });
//       },
//     })
//   },

//   mov_upload: function () { //数据上传    
//     let that = this;
//     console.log('位置数据检测：', that.data.picker);
//     let picker = that.data.picker;
//     let pics_ok = [];
//     //由于图片只能一张一张地上传，所以用循环
//     for (let i = 0; i < pics.length; i++) {
//       wx.uploadFile({
//         //路径填你上传图片方法的地址
//         url: 'http://wechat.homedoctor.com/Moments/upload_do',
//         filePath: pics[i],
//         name: 'move',
//         formData: {
//           'userId': wx.getStorageSync('userid')
//         },
//         success: function (res) {
//           console.log('上传成功');
//           //把上传成功的图片的地址放入数组中
//           pics_ok.push(res.data);
//           //如果全部传完，则可以将图片路径保存到数据库
//           if (pics_ok.length == pics.length) {
//             var userid = wx.getStorageSync('userid');
//             var content = that.data.content;
//             var label = that.data.label;
//             wx.request({
//               url: 'http://wechat.homedoctor.com/Moments/adds',
//               data: {
//                 user_id: userid,
//                 images: pics_ok,
//                 content: content,
//                 label: label,
//               },
//               success: function (res) {
//                 if (res.data.status == 1) {
//                   wx.hideLoading();
//                   wx.showModal({
//                     title: '提交成功',
//                     showCancel: false,
//                     success: function (res) {
//                       if (res.confirm) {
//                         wx.navigateTo({
//                           url: '/pages/my_moments/my_moments',
//                         });
//                       }
//                     }
//                   });
//                 }
//               }
//             });
//           }
//         },
//         fail: function (res) {
//           console.log('上传失败');
//         }
//       });
//     }
//   }
// })