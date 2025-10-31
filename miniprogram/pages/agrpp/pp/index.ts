import { Apis } from "../../../service/apiimpl";

const app = getApp();
app.BasePage({
  data: {
    ios: app.globalData.ios,
    content: null,
    title: '隐私政策'
  },

  onLoad() {
    Apis.getAgrPp('PP').then(res => {
      this.setData({
        content: res.data.content
      })
    })
  },

  handleBack() {
    const pages = getCurrentPages();
    if (pages.length < 2) return;
    const prePage = pages[pages.length - 2];
    prePage.setData({ isPPAgreed: true });
    wx.navigateBack();
  }
})