var QQMapWX = require('../lib/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
  data: {
    point: {
      // latitude: 39.749167,
      // longitude: 116.277778,
    },
    region: [],  //地理位置信息
    markers: [],
    items: [
      { value: 'walk', name: '步行' },
      { value: 'bus', name: '公交车', checked: 'true' },
      { value: 'subway', name: '地铁' },
      { value: 'car', name: '汽车' },
      { value: 'train', name: '火车' },
      { value: 'bike', name: '自行车' },
      { value: 'others', name: '其他'}
    ]
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
  onLoad: function (options) {
    let that = this;
    // 引入腾讯地图
    let qqmapsdk = new QQMapWX({
      key: 'FXWBZ-W47EW-JO7RV-RGO47-JOJOK-E7BTW' // 必填
    });
    // 使用 wx.createMapContext 获取 map 上下文
    that.mapCtx = wx.createMapContext('myMap');
    wx.getLocation({
      // 国内只能使用gcj02坐标系，wgs84不能使用；高德地图等都是使用的gcj02
      type: "gcj02",
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        // qqmapsdk.reverseGeocoder({
        //   location: {
        //     latitude: that.data.latitude,
        //     longitude: that.data.longitude
        //   },
        //   success: function (res) {
        //     console.log(res);
        //     that.setData({
        //       province: res.result.ad_info.province,
        //       city: res.result.ad_info.city,
        //       latitude: that.data.latitude,
        //       longitude: that.data.longitude
        //     })
        //   },
        //   fail: function (res) {
        //     console.log(res);
        //   }
        // });
      }
    })
   }
})