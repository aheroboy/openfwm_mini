import { Apis } from "../../../service/apiimpl";
const app = getApp();
app.BasePage({
  data: {
    ios: app.globalData.ios,
    width: 0,
    height: 0,
    spot: {},
    loginUserId: null
  },
  onReady: function (): void {
    const { windowHeight, windowWidth } = wx.getSystemInfoSync()
    this.setData({
      height: windowHeight,
      width: windowWidth
    })
  },

  onLoad(options: { spotId: string }) {
    const user = wx.getStorageSync("loginUser")
    this.setData({ loginUserId: user?.id})
    Apis.loadDiscoverSpot(options.spotId).then((res) => {
      console.info(options)
      this.setData({ spot: res });
    });
  },
  onCollectClicked() {
    Apis.collectSpot(this.data.spot.id)
      .then(() => {
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
      })
      .catch(err => {
        console.error('收藏失败:', err)
        wx.showToast({
          title: '收藏失败',
          icon: 'none',
          duration: 2000
        })
      })
  },
  onNavigatorClicked(): void {
    wx.navigateTo({
      url: `/pages/home/navigator/index?spotId=${this.data.spot.id}`,
    })
  },
  onHarvestPicClicked(e: WechatMiniprogram.TouchEvent): void {
    const pics: string[] = e.currentTarget.dataset.pics || [];
    if (pics.length === 0) return;

    try {
      wx.previewImage({
        current: pics[0],
        urls: pics
      });
    } catch (error) {
      console.error('图片预览失败:', error);
    }
  }
})
