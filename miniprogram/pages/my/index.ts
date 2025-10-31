const app = getApp()
import { Utils } from '../../utils/util'
app.BasePage({
    data: {
        // 用户信息
        ios: app.globalData.ios,
        userInfo: {
            avatarUrl: '',
            nickName: ''
        },
        // 当前选中的标签页
        currentTab: 'credit',

    },
    onLoad() {
        const wh = wx.getStorageSync('wh')
        const ww = wx.getStorageSync('WW')
        Utils.calculateMainHeight();
        this.setData({
            wh: wh,
            ww: ww
        })
    },
    onShow() {
        this.getUserInfo();
    },
    // 跳转到用户信息编辑页面
    navigateToUserEdit() {
        wx.navigateTo({
            url: '/pages/my/user-edit/index'
        })
    },
    // 获取用户信息
    getUserInfo() {
        const userInfo = wx.getStorageSync("loginUser")
        this.setData({
            userInfo: userInfo
        })
    },

    // 切换标签页
    switchTab(e: any) {
        const tab = e.currentTarget.dataset.tab
        this.setData({
            currentTab: tab
        })
    },

})