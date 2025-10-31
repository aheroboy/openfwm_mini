import apisImpl = require('../../../service/apiimpl');
const app = getApp();
app.BasePage({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  properties: {
    spotId: {
      type: String,
      value: ''
    }
  },
  data: {
    ios: app.globalData.ios,
    title: '步行钓点',
    nav: {}
  },
  onLoad(options: { spotId: string }) {
    const { spotId } = options;
    apisImpl.Apis.loadSpotNavigationInfo(spotId)
      .then(res => {
        let { latitude, longitude, name, line = [] } = res;
        const targetPoint = { latitude: latitude, longitude: longitude };
        let parkingPoint = targetPoint;
        const markerPoints = [targetPoint];
        if (line !== undefined && line.length > 0) {
          line.unshift(targetPoint);
          parkingPoint = {
            latitude: res.line[line.length - 1].latitude,
            longitude: res.line[line.length - 1].longitude,
          }
          markerPoints.push(parkingPoint);
        }
        const markers = this.toMarkStartEndPos(markerPoints, name);
        console.info(markers)
        this.setData({
          parkingPoint: parkingPoint,
          nav: {
            latitude: latitude,
            longitude: longitude,
            scale: 15,
            markers: markers,
            line: [{
              color: '#58c16c',
              width: 6,
              borderColor: '#2f693c',
              borderWidth: 1,
              points: line
            }]
          }
        })
      });
  },
  toMarkStartEndPos(arr: { latitude: number, longitude: number }[], name: string) {
    const POINT_TYPES = {
      START: '钓点',
      END: '停车点',
      DEFAULT: '钓点'
    };

    return arr.map((point, index) => {
      const text = index == 0 ? POINT_TYPES.START : POINT_TYPES.END;
      const id = Number(this._generateRandomNumer(10));
      return {
        latitude: point.latitude,
        longitude: point.longitude,
        width: 40,
        height: 40,
        id: id,
        label: {
          content: text,
          bgColor: '#FFF',
          borderRadius: 3,
          borderWidth: 1,
          padding: 2,
          textAline: 'center'
        }
      }
    });
  },
  _generateRandomNumer(length) {
      let result = '';
      for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
      }
      return result;
  },
  onGoNavClicked() {
    wx.openLocation(
      {
        latitude: this.data.parkingPoint.latitude,
        longitude: this.data.parkingPoint.longitude,
        scale: 16,
        name: "目的地",
        address: "钓点",
        fail: (err) => {
          console.info("位置打开失败:", err);
          wx.showToast({ title: '无法打开地图', icon: "none" });
        }
      }
    );
  }
})
