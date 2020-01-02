Page({
  data: {
    point: {
      latitude: 39.749167,
      longitude: 116.277778
    },
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
  onLoad: function () {
    console.log('地图定位接口getLocation还不能正常获取用户位置！')
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //我这里测试获取的数据一直是一样的（TIT创意园），官方接口没真正开放，还是没发布的原因
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        var point = {
          latitude: latitude,
          longitude: longitude
        }
        var markers = [{
          latitude: latitude,
          longitude: longitude,
          name: '地图定位',
          desc: '我现在的位置'
        }];
        that.setData(markers);
        that.setData(point);
      }
    })
  }
})