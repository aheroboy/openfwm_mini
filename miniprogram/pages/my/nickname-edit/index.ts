import { Apis } from "../../../service/apiimpl"
const app = getApp();
app.BasePage({
  data: {
    ios: app.globalData.ios,
    currentNickname: '',
    newNickname: ''
  },

  onLoad(options: { nickname?: string }) {
    this.setData({
      currentNickname: options.nickname || '未设置',
      newNickname: options.nickname || ''
    })
  },

  onInputChange(e: WechatMiniprogram.InputEvent) {
    this.setData({
      newNickname: e.detail.value.trim()
    })
  },

  saveNickname() {
    if (!this.data.newNickname || this.data.newNickname === this.data.currentNickname) {
      return
    }

    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    Apis.saveUserNickName(this.data.newNickname)?.then(res => {
      prevPage.setData({
        'userInfo.nickName': this.data.newNickname
      })
      wx.navigateBack()
      wx.showToast({
        title: '昵称修改成功',
        icon: 'success'
      }).catch(err => {
        wx.showToast({
          title: '昵称修改失败.',
          icon:'none'
        })
      })
    })


  }
})