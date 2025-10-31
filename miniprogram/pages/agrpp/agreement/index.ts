import { Apis } from "../../../service/apiimpl";
const app = getApp()
app.BasePage({
  data: {
    ios: app.globalData.ios,
    content: null,
    title: '用户协议'
  },

  onLoad() {
    Apis.getAgrPp('UA').then(res => {
      this.setData({
        content: res.data.content
      })
    })
  },

  handleBack() {
    const pages = getCurrentPages();
    if (pages.length < 2) return;
    const prePage = pages[pages.length - 2];
    prePage.setData({ isAgrAgreed: true });
    wx.navigateBack();
  }
})